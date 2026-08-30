"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FeedbackResult } from "@/types/feedback"
import { useProgress } from "@/hooks/useProgress"
import Building from "@/components/Building"
import PhraseOfDay from "@/components/PhraseOfDay"
import BuildingCheck from "@/components/BuildingCheck"
import ReadAloudButton from "@/components/ReadAloudButton"

type Props = {
  feedback: FeedbackResult
  essay: string
  day: number
  answerExample?: string
}

export default function FeedbackView({ feedback, essay, day, answerExample }: Props) {
  const { completeDay, progress, saveError } = useProgress()

  useEffect(() => {
    completeDay(day)
  }, [day, completeDay])

  return (
    <div className="flex flex-col gap-5">
      {feedback.isMock && process.env.NODE_ENV === "development" && (
        <div className="rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-600">
          デモモード — .env.local に OPENAI_API_KEY を追加するとAIフィードバックが使えます。
        </div>
      )}

      {saveError && (
        <div className="rounded-xl bg-red-50 px-4 py-2 text-xs text-red-600">{saveError}</div>
      )}

      {/* ① Praise */}
      <div className="rounded-2xl bg-indigo-50 p-5">
        <p className="text-sm font-bold text-indigo-500">🎉 よくできました！</p>
        <p className="mt-2 text-sm leading-relaxed text-indigo-900">{feedback.praise}</p>
      </div>

      {/* ② Good Points */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-bold tracking-wider text-gray-400">良かったところ</p>
        <ul className="mt-3 flex flex-col gap-2">
          {feedback.goodPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 shrink-0 text-green-500">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* ③ One Improvement */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-bold tracking-wider text-gray-400">次に伸ばしたいポイント</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{feedback.oneImprovement}</p>
      </div>

      {/* ④ Today's Phrase */}
      <PhraseOfDay />

      {/* ⑤ Building Check */}
      <BuildingCheck essay={essay} />

      {/* ⑥ Answer Example */}
      {answerExample && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold tracking-wider text-gray-400">📝 解答例</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {answerExample}
          </p>
          <ReadAloudButton text={answerExample} />
          <p className="mt-2 text-xs text-gray-400">声に出してマネしましょう！</p>
          <p className="mt-3 text-xs text-gray-400">
            ※ 英作文にはさまざまな表現があります。これは解答例の一つです。
          </p>
        </div>
      )}

      {/* ⑦ Building Completion */}
      <div className="rounded-2xl bg-green-50 p-6 text-center">
        <div className="mb-3 flex justify-center">
          <Building
            currentFloor={progress.completedDays.length}
            totalFloors={90}
            animated
          />
        </div>
        <p className="text-sm font-bold text-green-700">Day {day} 完成！🎉</p>
        <p className="mt-1 text-xs text-green-500">タワーが育っています。明日も続けよう！</p>
      </div>

      <Link
        href="/"
        className="flex h-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        ホームへ戻る
      </Link>
    </div>
  )
}
