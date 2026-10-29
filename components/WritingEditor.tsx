"use client"

import { useEffect, useRef, useState } from "react"
import { Lesson } from "@/types/lesson"
import { FeedbackResult } from "@/types/feedback"
import FeedbackView from "@/components/FeedbackView"
import WritingScaffold from "@/components/WritingScaffold"
import EmailScaffold from "@/components/EmailScaffold"
import { useStudent } from "@/components/StudentGate"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { countWords, MAX_ESSAY_CHARS } from "@/lib/essay"
import { clearDraft, loadDraft, saveDraft } from "@/lib/draft"
import { submitFeedback } from "@/lib/feedbackClient"

type SubmitError = { message: string; needsLogin: boolean }

type Props = {
  lesson: Lesson
}

export default function WritingEditor({ lesson }: Props) {
  const { studentId } = useStudent()
  const [text, setText] = useState(() => loadDraft(studentId, lesson.id))
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [error, setError] = useState<SubmitError | null>(null)
  // Synchronous guard: state updates are async, so two fast taps could
  // otherwise both pass a `submitting` check and send twice.
  const inFlight = useRef(false)

  useEffect(() => {
    saveDraft(studentId, lesson.id, text)
  }, [studentId, lesson.id, text])

  const wordCount = countWords(text)
  const isReady =
    wordCount >= lesson.wordCount.min &&
    wordCount <= lesson.wordCount.max &&
    text.length <= MAX_ESSAY_CHARS

  async function handleSubmit() {
    if (inFlight.current || !isReady) return
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

      const result = await submitFeedback(token, lesson.id, text)
      if (result.ok) {
        clearDraft(studentId, lesson.id)
        setFeedback(result.feedback)
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

  if (feedback) {
    return (
      <FeedbackView
        feedback={feedback}
        essay={text}
        day={lesson.day}
        answerExample={lesson.answerExample}
        lessonType={lesson.type}
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
            onClick={handleSubmit}
            disabled={!isReady || submitting}
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
