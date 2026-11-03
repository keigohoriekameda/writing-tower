"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FeedbackResult } from "@/types/feedback"
import { useProgress } from "@/hooks/useProgress"
import Building from "@/components/Building"
import PhraseOfDay from "@/components/PhraseOfDay"
import BuildingCheck from "@/components/BuildingCheck"
import ReadAloudButton from "@/components/ReadAloudButton"
import SyncErrorBanner from "@/components/SyncErrorBanner"
import {
  GoodPointsCard,
  PriorityItemCard,
  RevisionResultCard,
  ScoreCard,
  WordCountCard,
} from "@/components/FeedbackParts"

type Props = {
  feedback: FeedbackResult
  /** The review of the earlier version, when this is a re-review. */
  previous?: FeedbackResult
  essay: string
  day: number
  answerExample?: string
  /** The "First / Second / So" Building Check only fits opinion essays. */
  lessonType: "opinion" | "email"
  /** Offered when there is something to fix. */
  onRewrite?: () => void
}

export default function FeedbackView({
  feedback,
  previous,
  essay,
  day,
  answerExample,
  lessonType,
  onRewrite,
}: Props) {
  const { completeDay, progress, saveError, resync } = useProgress()
  const isDemo = feedback.isMock === true
  const inRange = feedback.word_count_analysis.status === "IN_RANGE"
  const completes = !isDemo && inRange
  const [showExample, setShowExample] = useState(Boolean(previous))
  const items = feedback.priority_feedback_items

  // A Day counts only for a genuine review of an answer in the word range.
  // Demo (mock) feedback and out-of-range answers never complete a Day;
  // completeDay itself is idempotent per day.
  useEffect(() => {
    if (completes) void completeDay(day)
  }, [day, completes, completeDay])

  return (
    <div className="flex flex-col gap-5">
      {isDemo && (
        <div role="status" className="rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-700">
          デモ表示です（開発用）。これはあなたの英文への添削ではなく、Dayも完了になりません。
        </div>
      )}

      {saveError && <SyncErrorBanner message={saveError} onResync={resync} />}

      <div className="rounded-2xl bg-indigo-50 p-5">
        <p className="text-sm font-bold text-indigo-500">
          {isDemo ? "デモ" : previous ? "🔁 再添削の結果" : "🎉 添削できました"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-indigo-900">{feedback.overall_comment_ja}</p>
      </div>

      <ScoreCard feedback={feedback} previous={previous} />
      <WordCountCard words={feedback.word_count_analysis} />
      <GoodPointsCard points={feedback.good_points} />

      {feedback.revision_check && (
        <RevisionResultCard checks={feedback.revision_check} previousItems={previous?.priority_feedback_items ?? []} />
      )}

      {items.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold tracking-wider text-gray-400">
            次に直したいポイント（{items.length}つ）
          </p>
          {items.map((item, i) => (
            <PriorityItemCard key={item.original_snippet} item={item} index={i} />
          ))}
        </div>
      ) : (
        !isDemo && (
          <div className="rounded-2xl bg-green-50 p-5 text-sm text-green-800">
            直すべきポイントはありません。この調子で書き続けましょう！
          </div>
        )
      )}

      {onRewrite && !isDemo && (items.length > 0 || !inRange) && (
        <button
          type="button"
          onClick={onRewrite}
          className="h-12 rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          ✏️ 自分で書き直す
        </button>
      )}

      <PhraseOfDay />

      {lessonType === "opinion" && <BuildingCheck essay={essay} />}

      {answerExample && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold tracking-wider text-gray-400">📝 解答例</p>
          {showExample ? (
            <>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">{answerExample}</p>
              <ReadAloudButton text={answerExample} />
              <p className="mt-2 text-xs text-gray-400">声に出してマネしましょう！</p>
              <p className="mt-3 text-xs text-gray-400">
                ※ 英作文にはさまざまな表現があります。これは解答例の一つで、高得点を保証するものではありません。
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                まず自分で書き直してから見ると、力がつきます。
              </p>
              <button
                type="button"
                onClick={() => setShowExample(true)}
                className="mt-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                解答例を見る
              </button>
            </>
          )}
        </div>
      )}

      {!isDemo &&
        (completes ? (
          <div className="rounded-2xl bg-green-50 p-6 text-center">
            <div className="mb-3 flex justify-center">
              <Building currentFloor={progress.completedDays.length} totalFloors={90} animated />
            </div>
            <p className="text-sm font-bold text-green-700">Day {day} 完成！🎉</p>
            <p className="mt-1 text-xs text-green-500">タワーが育っています。明日も続けよう！</p>
          </div>
        ) : (
          <div role="status" className="rounded-2xl bg-amber-50 p-5 text-center text-sm text-amber-800">
            語数が目安の範囲に入っていないため、まだDay {day} は完了になっていません。
            {onRewrite ? "書き直して、範囲に入れましょう。" : ""}
          </div>
        ))}

      <Link
        href="/"
        className="flex h-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        ホームへ戻る
      </Link>
    </div>
  )
}
