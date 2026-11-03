"use client"

import { useEffect, useRef, useState } from "react"
import { Lesson } from "@/types/lesson"
import { FeedbackResult, RevisionRequest } from "@/types/feedback"
import FeedbackView from "@/components/FeedbackView"
import RewriteMission from "@/components/RewriteMission"
import WritingScaffold from "@/components/WritingScaffold"
import EmailScaffold from "@/components/EmailScaffold"
import { useStudent } from "@/components/StudentGate"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { countWords, MAX_ESSAY_CHARS, MAX_REVIEW_WORD_FACTOR, MIN_REVIEW_WORDS } from "@/lib/essay"
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft"
import { submitFeedback } from "@/lib/feedbackClient"

type SubmitError = { message: string; needsLogin: boolean }

/** write -> first review -> (rewrite -> re-review). */
type Phase = "write" | "reviewed" | "rewrite" | "rereviewed"

type Props = {
  lesson: Lesson
}

export default function WritingEditor({ lesson }: Props) {
  const { studentId } = useStudent()
  const [text, setText] = useState(() => loadDraft(studentId, lesson.id))
  const [submitting, setSubmitting] = useState(false)
  const [phase, setPhase] = useState<Phase>("write")
  const [first, setFirst] = useState<{ feedback: FeedbackResult; text: string } | null>(null)
  const [second, setSecond] = useState<{ feedback: FeedbackResult; text: string } | null>(null)
  const [error, setError] = useState<SubmitError | null>(null)
  // Synchronous guard: state updates are async, so two fast taps could
  // otherwise both pass a `submitting` check and send twice.
  const inFlight = useRef(false)

  // Keep the work-in-progress on this device while the student is typing or rewriting;
  // once a review is on screen the draft is no longer needed.
  useEffect(() => {
    if (phase === "write" || phase === "rewrite") saveDraft(studentId, lesson.id, text)
  }, [studentId, lesson.id, text, phase])

  const wordCount = countWords(text)
  const inRange = wordCount >= lesson.wordCount.min && wordCount <= lesson.wordCount.max
  const reviewable =
    wordCount >= MIN_REVIEW_WORDS &&
    wordCount <= lesson.wordCount.max * MAX_REVIEW_WORD_FACTOR &&
    text.length <= MAX_ESSAY_CHARS

  /** One guarded request for either the first review or a re-review. */
  async function review(revision?: RevisionRequest) {
    if (inFlight.current || !reviewable) return
    inFlight.current = true
    setSubmitting(true)
    setError(null)
    try {
      const { data } = await createSupabaseBrowserClient().auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        setError({
          message: "ログインの有効期限が切れました。ページを読み込み直して、もう一度ログインしてください（入力した英文はこの端末に残っています）。",
          needsLogin: true,
        })
        return
      }

      const result = await submitFeedback(token, lesson.id, text, revision)
      if (result.ok) {
        if (revision) {
          setSecond({ feedback: result.feedback, text })
          setPhase("rereviewed")
          clearDraft(studentId, lesson.id)
        } else {
          setFirst({ feedback: result.feedback, text })
          setPhase("reviewed")
          clearDraft(studentId, lesson.id)
        }
      } else {
        setError({
          message: result.message,
          needsLogin: result.code === "unauthenticated" || result.code === "forbidden",
        })
      }
    } finally {
      inFlight.current = false
      setSubmitting(false)
    }
  }

  function startRewrite() {
    setError(null)
    setPhase("rewrite")
  }

  function submitRewrite() {
    const base = second ?? first
    if (!base) return
    void review({
      previousEssay: base.text,
      previousItems: base.feedback.priority_feedback_items.map((i) => ({
        error_code: i.error_code,
        original_snippet: i.original_snippet,
      })),
    })
  }

  if (phase === "rewrite" && (second ?? first)) {
    const base = (second ?? first)!
    return (
      <RewriteMission
        items={base.feedback.priority_feedback_items}
        text={text}
        onTextChange={setText}
        reviewedText={base.text}
        words={{ count: wordCount, min: lesson.wordCount.min, max: lesson.wordCount.max }}
        submitting={submitting}
        error={error}
        onSubmit={submitRewrite}
        onSkip={() => {
          setText(base.text)
          setError(null)
          setPhase(second ? "rereviewed" : "reviewed")
          clearDraft(studentId, lesson.id)
        }}
      />
    )
  }

  if (phase === "reviewed" && first) {
    return (
      <FeedbackView
        feedback={first.feedback}
        essay={first.text}
        day={lesson.day}
        answerExample={lesson.answerExample}
        lessonType={lesson.type}
        onRewrite={startRewrite}
      />
    )
  }

  if (phase === "rereviewed" && second && first) {
    return (
      <FeedbackView
        feedback={second.feedback}
        previous={first.feedback}
        essay={second.text}
        day={lesson.day}
        answerExample={lesson.answerExample}
        lessonType={lesson.type}
        onRewrite={startRewrite}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {lesson.type === "email" ? <EmailScaffold /> : <WritingScaffold />}

      <div className="rounded-2xl bg-indigo-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Question</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-indigo-800">{lesson.prompt}</p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lesson.type === "email" ? "Write your email here..." : "Write your essay here..."}
        rows={10}
        maxLength={MAX_ESSAY_CHARS}
        readOnly={submitting}
        aria-label="Your English writing"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-900 placeholder-gray-300 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 read-only:bg-gray-50"
      />

      {error && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">添削できませんでした</p>
          <p className="mt-1 leading-relaxed">{error.message}</p>
          <p className="mt-1 text-xs text-red-500">
            入力した英文はそのまま残っています。この回の失敗ではDayは完了になりません。
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <WordCountBadge count={wordCount} min={lesson.wordCount.min} max={lesson.wordCount.max} />
        {error?.needsLogin ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            ページを読み込み直す
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void review()}
            disabled={!reviewable || submitting}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {submitting
              ? "添削中…"
              : error
                ? "もう一度送る"
                : lesson.type === "email"
                  ? "Send Email"
                  : "Submit Essay"}
          </button>
        )}
      </div>

      {reviewable && !inRange && (
        <p role="status" className="text-xs leading-relaxed text-amber-600">
          語数が目安（{lesson.wordCount.min}〜{lesson.wordCount.max}語）の範囲外です。添削は受けられますが、Dayの完了には範囲内の語数が必要です。
        </p>
      )}

      {submitting && (
        <div role="status" className="flex items-center justify-center gap-3 text-sm text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          <p>コーチがあなたの英文を読んでいます…（そのままお待ちください）</p>
        </div>
      )}
    </div>
  )
}

function WordCountBadge({ count, min, max }: { count: number; min: number; max: number }) {
  const colorClass =
    count === 0
      ? "text-gray-400"
      : count < min
        ? "text-orange-500"
        : count > max
          ? "text-red-500"
          : "text-green-600"

  return (
    <span className={`text-sm font-medium ${colorClass}`}>
      {count} / {min}–{max} words
    </span>
  )
}
