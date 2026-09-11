import { describe, expect, it } from "vitest"
import { Progress } from "@/types/progress"
import { Lesson } from "@/types/lesson"
import { lessons } from "@/data/lessons"
import {
  formatPendingLessonMessage,
  getNextIncompleteDay,
  getNextLessonStatus,
  TOTAL_PROGRAM_DAYS,
} from "@/lib/progressSelectors"

function mk(days: number[]): Progress {
  return { completedDays: days.map((day) => ({ day, completedAt: new Date().toISOString() })) }
}

function mkLesson(day: number): Lesson {
  return {
    id: `day-${day}`,
    day,
    type: "opinion",
    title: `Day ${day}`,
    topic: "topic",
    prompt: "prompt",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
  }
}

const sevenDayLessons = [1, 2, 3, 4, 5, 6, 7].map(mkLesson)
const fourteenDayLessons = Array.from({ length: 14 }, (_, i) => mkLesson(i + 1))

describe("getNextLessonStatus", () => {
  it("returns the Day1 lesson for a brand-new student (existing Day1-7 behavior)", () => {
    const status = getNextLessonStatus(mk([]), sevenDayLessons)
    expect(status).toEqual({ kind: "lesson", lesson: sevenDayLessons[0] })
  })

  it("still resolves each of Day1-7 in order as earlier days complete", () => {
    for (let completed = 0; completed < 7; completed++) {
      const days = Array.from({ length: completed }, (_, i) => i + 1)
      const status = getNextLessonStatus(mk(days), sevenDayLessons)
      expect(status).toEqual({ kind: "lesson", lesson: sevenDayLessons[completed] })
    }
  })

  it("shows Day8 once Day7 is completed, instead of the old 'all lessons complete' fallback", () => {
    const status = getNextLessonStatus(mk([1, 2, 3, 4, 5, 6, 7]), fourteenDayLessons)
    expect(status).toEqual({ kind: "lesson", lesson: fourteenDayLessons[7] })
  })

  it("reports 'pending' (not 'complete') once every authored Day (1-14) is finished", () => {
    const status = getNextLessonStatus(mk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]), fourteenDayLessons)
    expect(status).toEqual({ kind: "pending", lastAvailableDay: 14 })
  })

  it("is gap-safe across the Day7/Day8 boundary: a missing Day2 blocks Day8 from showing", () => {
    const status = getNextLessonStatus(mk([1, 3, 4, 5, 6, 7]), fourteenDayLessons)
    expect(status).toEqual({ kind: "lesson", lesson: fourteenDayLessons[1] }) // Day 2
  })

  it("only reports 'complete' once the full TOTAL_PROGRAM_DAYS-day program is finished", () => {
    const allDays = Array.from({ length: TOTAL_PROGRAM_DAYS }, (_, i) => i + 1)
    const ninetyDayLessons = allDays.map(mkLesson)
    const status = getNextLessonStatus(mk(allDays), ninetyDayLessons)
    expect(status).toEqual({ kind: "complete" })
  })
})

describe("getNextLessonStatus with the real lesson data (Day1-30)", () => {
  it("progresses from Day14 to Day15 once Day1-14 are completed", () => {
    const days1to14 = Array.from({ length: 14 }, (_, i) => i + 1)
    const status = getNextLessonStatus(mk(days1to14), lessons)
    expect(status.kind).toBe("lesson")
    if (status.kind === "lesson") expect(status.lesson.day).toBe(15)
  })

  it("shows the Day30-aware pending message once Day1-30 are all completed", () => {
    const days1to30 = Array.from({ length: 30 }, (_, i) => i + 1)
    const status = getNextLessonStatus(mk(days1to30), lessons)
    expect(status).toEqual({ kind: "pending", lastAvailableDay: 30 })
    if (status.kind === "pending") {
      expect(formatPendingLessonMessage(status.lastAvailableDay)).toBe(
        "Day30まで完了しました。次のレッスンを準備中です。"
      )
    }
  })
})

describe("formatPendingLessonMessage", () => {
  it("names the last authored day and says the next one is being prepared", () => {
    expect(formatPendingLessonMessage(14)).toBe("Day14まで完了しました。次のレッスンを準備中です。")
  })
})

describe("getNextIncompleteDay (regression)", () => {
  it("returns Day 8 once Day1-7 are complete", () => {
    expect(getNextIncompleteDay(mk([1, 2, 3, 4, 5, 6, 7]))).toBe(8)
  })
})
