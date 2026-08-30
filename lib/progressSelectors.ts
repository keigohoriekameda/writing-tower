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
