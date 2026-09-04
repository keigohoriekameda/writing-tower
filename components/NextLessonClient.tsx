"use client"

import { useProgress } from "@/hooks/useProgress"
import { lessons } from "@/data/lessons"
import LessonCard from "@/components/LessonCard"
import { getNextLessonStatus, formatPendingLessonMessage } from "@/lib/progressSelectors"

export default function NextLessonClient() {
  const { progress } = useProgress()
  const status = getNextLessonStatus(progress, lessons)

  if (status.kind === "lesson") {
    return (
      <div className="flex flex-col gap-5">
        <MissionBanner />
        <LessonCard lesson={status.lesson} />
      </div>
    )
  }

  if (status.kind === "pending") {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-center">
        <p className="text-lg">📚</p>
        <p className="mt-2 text-sm font-bold text-indigo-700">
          {formatPendingLessonMessage(status.lastAvailableDay)}
        </p>
        <p className="mt-1 text-xs text-indigo-500">
          もうしばらくお待ちください。続きが公開され次第、タワーが再び伸びていきます。
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-6 text-center">
      <p className="text-lg">🎉</p>
      <p className="mt-2 text-sm font-bold text-green-700">全レッスン完了！</p>
      <p className="mt-1 text-xs text-green-500">素晴らしい継続力です。タワーが完成しました。</p>
    </div>
  )
}

function MissionBanner() {
  return (
    <div className="mb-1 rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 px-5 py-4 text-center">
      <p className="text-sm font-bold text-indigo-700">🎯 ✨ 今日のミッション！</p>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
        下のカードをタップして、
        <br />
        <span className="font-bold text-indigo-600">1階建設</span>を始めよう！ ↓
      </p>
    </div>
  )
}
