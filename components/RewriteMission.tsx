"use client"

import { useState } from "react"
import { PriorityFeedbackItem } from "@/types/feedback"
import { applyReplacement, matchesBlank } from "@/lib/blank"
import { Quote } from "@/components/FeedbackParts"

type Props = {
  items: PriorityFeedbackItem[]
  text: string
  onTextChange: (text: string) => void
  /** Text of the version that was reviewed (the re-review button needs a change). */
  reviewedText: string
  words: { count: number; min: number; max: number }
  submitting: boolean
  error: { message: string; needsLogin: boolean } | null
  onSubmit: () => void
  onSkip: () => void
}

/**
 * Step 6 of the review flow: the student fixes their OWN text. Fix suggestions
 * stay hidden until asked for; small form problems get a fill-in drill whose
 * answer the student must type, and then confirms in the whole sentence.
 */
export default function RewriteMission({
  items,
  text,
  onTextChange,
  reviewedText,
  words,
  submitting,
  error,
  onSubmit,
  onSkip,
}: Props) {
  const changed = text.trim() !== reviewedText.trim()
  return (
    <div className="flex flex-col gap-5" data-testid="rewrite-mission">
      <div className="rounded-2xl bg-indigo-50 p-5">
        <p className="text-sm font-bold text-indigo-600">✏️ 書き直しミッション</p>
        <p className="mt-2 text-xs leading-relaxed text-indigo-800">
          下の{items.length > 0 ? `${items.length}つのポイント` : "答案"}を、自分の力で直してみましょう。直したら「再添削する」を押します。答えを丸写しする必要はありません。
        </p>
      </div>

      {items.map((item, i) => (
        <RewriteItem key={item.original_snippet} item={item} index={i} text={text} onApply={onTextChange} />
      ))}

      <div>
        <label htmlFor="rewrite-text" className="text-xs font-semibold tracking-wider text-gray-400">
          あなたの英文（直したいところを書き換えてください）
        </label>
        <textarea
          id="rewrite-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={10}
          readOnly={submitting}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-900 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 read-only:bg-gray-50"
        />
        <p className="mt-1 text-sm font-medium text-gray-500">
          {words.count} 語（目安 {words.min}〜{words.max}語）
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">再添削できませんでした</p>
          <p className="mt-1 leading-relaxed">{error.message}</p>
          <p className="mt-1 text-xs text-red-500">書き直した英文はそのまま残っています。</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSkip}
          disabled={submitting}
          className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 disabled:opacity-40"
        >
          書き直さずに終わる
        </button>
        {error?.needsLogin ? (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white"
          >
            ページを読み込み直す
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!changed || submitting}
            className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {submitting ? "再添削中…" : error ? "もう一度送る" : "再添削する"}
          </button>
        )}
      </div>
      {!changed && !submitting && (
        <p className="-mt-3 text-center text-xs text-gray-400">英文を直すと「再添削する」が押せるようになります。</p>
      )}
    </div>
  )
}

function RewriteItem({
  item,
  index,
  text,
  onApply,
}: {
  item: PriorityFeedbackItem
  index: number
  text: string
  onApply: (text: string) => void
}) {
  const [hint, setHint] = useState(false)
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-4" data-testid="rewrite-item">
      <p className="text-sm font-bold text-gray-800">
        <span className="mr-1 text-amber-500">{index + 1}.</span>
        {item.title_ja}
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        <Quote label="あなたの英文" text={item.original_snippet} tone="student" />
        {item.task_snippet && <Quote label="メール本文" text={item.task_snippet} tone="task" />}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-gray-600">{item.explanation_ja}</p>

      {item.fill_blank && <BlankDrill item={item} text={text} onApply={onApply} />}

      {item.suggested_snippet &&
        (hint ? (
          <p className="mt-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-800">
            <span className="mr-2 text-[10px] font-bold uppercase tracking-wide opacity-60">修正例</span>
            {item.suggested_snippet}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setHint(true)}
            className="mt-2 rounded-full border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-500 hover:bg-indigo-50"
          >
            ヒント（修正例）を見る
          </button>
        ))}
    </div>
  )
}

function BlankDrill({
  item,
  text,
  onApply,
}: {
  item: PriorityFeedbackItem
  text: string
  onApply: (text: string) => void
}) {
  const fb = item.fill_blank!
  const [value, setValue] = useState("")
  const [checked, setChecked] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const correct = checked && matchesBlank(value, fb.acceptable_answers)

  const typed = value.trim().replace(/[.,!?;:]+$/, "")

  function apply() {
    const next = applyReplacement(text, item.original_snippet, fb.prompt.replace("___", typed))
    if (next === null) {
      setNote("この文は書き換えられているので、下の英文を自分で直してください。")
      return
    }
    onApply(next)
    setNote("あなたの英文に反映しました。")
  }

  return (
    <div className="mt-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3" data-testid="blank-drill">
      <p className="text-[11px] font-bold tracking-wide text-gray-400">穴埋めで練習</p>
      <p className="mt-1 text-sm text-gray-800">{fb.prompt.replace("___", "[ ___ ]")}</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setChecked(false)
            setNote(null)
          }}
          aria-label="穴埋めの答え"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-40 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-300 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={value.trim() === ""}
          className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white disabled:bg-gray-200 disabled:text-gray-400"
        >
          答え合わせ
        </button>
      </div>
      {checked && !correct && <p className="mt-2 text-xs text-red-500">おしい！もう一度考えてみましょう。</p>}
      {correct && (
        <div className="mt-2 text-xs text-green-700">
          <p className="font-semibold">○ 正解！完成した英文を声に出して確認しましょう。</p>
          <p className="mt-1 rounded-lg bg-white px-3 py-1.5 text-sm text-gray-800">{fb.prompt.replace("___", typed)}</p>
          <button
            type="button"
            onClick={apply}
            className="mt-2 rounded-full border border-green-300 bg-white px-3 py-1 text-xs font-medium text-green-700"
          >
            自分の英文に反映する
          </button>
        </div>
      )}
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  )
}
