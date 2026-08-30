"use client"

import { useProgress } from "@/hooks/useProgress"
import { getNextIncompleteDay } from "@/lib/progress"
import { lessons } from "@/data/lessons"
import LessonCard from "@/components/LessonCard"

export default function NextLessonClient() {
  const { progress } = useProgress()
  // completedDays.length ではなく、Day1から見て最初の未完了Dayを次回レッスンとする。
  // マージ等でcompletedDaysに欠番が生じても、未完了のDayを飛ばして誤表示しないようにするため。
  const nextDay = getNextIncompleteDay(progress.completedDays)
  const nextLesson = lessons.find((lesson) => lesson.day === nextDay)

  if (!nextLesson) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-6 text-center">
        <p className="text-lg">🎉</p>
        <p className="mt-2 text-sm font-bold text-green-700">全レッスン完了！</p>
        <p className="mt-1 text-xs text-green-500">
          素晴らしい継続力です。次のレッスンをお待ちください。
        </p>
      </div>
    )
  }

  return <LessonCard lesson={nextLesson} />
}
