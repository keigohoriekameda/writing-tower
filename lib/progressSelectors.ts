import { Lesson } from "@/types/lesson"
import { Progress } from "@/types/progress"

/**
 * The next lesson day a student should see. Deliberately NOT
 * `completedDays.length + 1` — that assumes completed days form a
 * gap-free 1..N run, which breaks if a day is ever missing (a failed
 * sync, a manually-edited record, etc.) by silently re-showing or
 * skipping a day. Walking up from Day 1 for the first uncompleted day is
 * correct regardless of gaps.
 */
export function getNextIncompleteDay(progress: Progress): number {
  const completed = new Set(progress.completedDays.map((d) => d.day))
  let day = 1
  while (completed.has(day)) day++
  return day
}

/** The full length of the planned Writing Tower program, independent of how many days currently have authored content. */
export const TOTAL_PROGRAM_DAYS = 90

export type NextLessonStatus =
  | { kind: "lesson"; lesson: Lesson }
  | { kind: "pending"; lastAvailableDay: number }
  | { kind: "complete" }

/**
 * Resolves what to show for "the next lesson", distinguishing two very
 * different situations that both look like "no lesson found":
 *
 * - `pending`: the student is caught up with every Day we've authored so
 *   far, but the program isn't over yet (content for later Days hasn't
 *   been written). This must never be reported as "all lessons complete".
 * - `complete`: the student has finished the entire `TOTAL_PROGRAM_DAYS`
 *   program.
 */
export function getNextLessonStatus(progress: Progress, lessons: Lesson[]): NextLessonStatus {
  const nextDay = getNextIncompleteDay(progress)
  const lesson = lessons.find((l) => l.day === nextDay)
  if (lesson) return { kind: "lesson", lesson }

  if (nextDay > TOTAL_PROGRAM_DAYS) return { kind: "complete" }

  const lastAvailableDay = lessons.reduce((max, l) => Math.max(max, l.day), 0)
  return { kind: "pending", lastAvailableDay }
}

export function formatPendingLessonMessage(lastAvailableDay: number): string {
  return `Day${lastAvailableDay}まで完了しました。次のレッスンを準備中です。`
}
