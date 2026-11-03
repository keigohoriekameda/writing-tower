"use client"

import { useState } from "react"
import {
  FeedbackResult,
  GoodPoint,
  PriorityFeedbackItem,
  RevisionCheck,
  ScoreCriterion,
  WordCountAnalysis,
} from "@/types/feedback"

const CRITERION_LABEL: Record<ScoreCriterion, string> = {
  content: "内容",
  structure: "構成",
  vocabulary: "語彙",
  grammar: "文法",
}

export function ScoreCard({ feedback, previous }: { feedback: FeedbackResult; previous?: FeedbackResult }) {
  const s = feedback.score_summary
  const keys = (Object.keys(s.breakdown) as ScoreCriterion[]).filter((k) => s.breakdown[k] !== undefined)
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm" data-testid="score-card">
      <p className="text-xs font-bold tracking-wider text-gray-400">推定スコア（学習用）</p>
      <p className="mt-2 text-3xl font-bold text-indigo-600">
        {s.total_score}
        <span className="text-base font-medium text-gray-400"> / {s.max_score}点</span>
        {previous && previous.score_summary.total_score !== s.total_score && (
          <span className="ml-2 text-sm font-semibold text-emerald-600">
            （前回 {previous.score_summary.total_score}点）
          </span>
        )}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {keys.map((k) => (
          <li key={k} className="text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium">{CRITERION_LABEL[k]}</span>
              <span aria-label={`${CRITERION_LABEL[k]} ${s.breakdown[k]}点 / 4点`}>
                {"●".repeat(s.breakdown[k] ?? 0)}
                <span className="text-gray-200">{"●".repeat(4 - (s.breakdown[k] ?? 0))}</span>
                <span className="ml-1 text-xs text-gray-400">{s.breakdown[k]}/4</span>
              </span>
            </div>
            {s.reasons_ja[k] && <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{s.reasons_ja[k]}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-gray-400">{s.disclaimer_ja}</p>
    </div>
  )
}

export function WordCountCard({ words }: { words: WordCountAnalysis }) {
  const tone =
    words.status === "IN_RANGE" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
  const message =
    words.status === "IN_RANGE"
      ? "語数はちょうど良い範囲です。"
      : words.status === "TOO_SHORT"
        ? `語数が足りません。あと${words.min - words.actual_count}語以上、内容を書き足しましょう（同じ文句をくり返すのではなく、理由や説明を増やします）。`
        : `語数が多すぎます。${words.actual_count - words.max}語ほど減らしましょう。`
  return (
    <div className={`rounded-2xl px-5 py-3 text-sm ${tone}`} data-testid="word-count">
      <p className="font-semibold">
        語数: {words.actual_count}語（目安 {words.min}〜{words.max}語）
      </p>
      <p className="mt-1 text-xs leading-relaxed">{message}</p>
    </div>
  )
}

export function GoodPointsCard({ points }: { points: GoodPoint[] }) {
  if (points.length === 0) return null
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold tracking-wider text-gray-400">良かったところ</p>
      <ul className="mt-3 flex flex-col gap-3">
        {points.map((p, i) => (
          <li key={i} className="text-sm text-gray-700">
            <p className="rounded-lg bg-green-50 px-3 py-1.5 text-green-800">
              <span className="mr-1 text-green-500">✓</span>“{p.original_snippet}”
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{p.explanation_ja}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Quote({ label, text, tone }: { label: string; text: string; tone: "student" | "task" }) {
  return (
    <p
      className={`rounded-lg px-3 py-1.5 text-sm ${
        tone === "student" ? "bg-amber-50 text-amber-900" : "bg-gray-100 text-gray-700"
      }`}
    >
      <span className="mr-2 text-[10px] font-bold uppercase tracking-wide opacity-60">{label}</span>“{text}”
    </p>
  )
}

/** The suggested fix stays hidden until asked for, so the student tries first. */
export function PriorityItemCard({ item, index }: { item: PriorityFeedbackItem; index: number }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-4" data-testid="priority-item">
      <p className="text-sm font-bold text-gray-800">
        <span className="mr-1 text-amber-500">{index + 1}.</span>
        {item.title_ja}
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        <Quote label="あなたの英文" text={item.original_snippet} tone="student" />
        {item.task_snippet && <Quote label="メール本文" text={item.task_snippet} tone="task" />}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-gray-600">{item.explanation_ja}</p>
      {item.suggested_snippet &&
        (shown ? (
          <p className="mt-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-800">
            <span className="mr-2 text-[10px] font-bold uppercase tracking-wide opacity-60">修正例</span>
            {item.suggested_snippet}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setShown(true)}
            className="mt-2 rounded-full border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-500 hover:bg-indigo-50"
          >
            まず自分で考えてから、修正例を見る
          </button>
        ))}
    </div>
  )
}

const STATUS_LABEL: Record<RevisionCheck["status"], { text: string; cls: string }> = {
  FIXED: { text: "直せました", cls: "bg-green-50 text-green-700" },
  PARTLY_FIXED: { text: "もう少し", cls: "bg-amber-50 text-amber-700" },
  NOT_FIXED: { text: "まだ直っていません", cls: "bg-red-50 text-red-600" },
}

export function RevisionResultCard({
  checks,
  previousItems,
}: {
  checks: RevisionCheck[]
  previousItems: PriorityFeedbackItem[]
}) {
  if (checks.length === 0) return null
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm" data-testid="revision-result">
      <p className="text-xs font-bold tracking-wider text-gray-400">書き直しの結果</p>
      <ul className="mt-3 flex flex-col gap-3">
        {checks.map((c) => {
          const prev = previousItems.find((i) => i.error_code === c.error_code)
          const st = STATUS_LABEL[c.status]
          return (
            <li key={c.error_code} className="text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.cls}`}>{st.text}</span>
                <span className="font-medium">{prev?.title_ja ?? c.error_code}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{c.comment_ja}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
