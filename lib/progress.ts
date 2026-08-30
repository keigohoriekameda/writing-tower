import { DayProgress, Progress } from "@/types/progress"

// 進捗は後退させない：2つの進捗をDay番号でunionし、より進んでいる側を残す。
// 同じDayが両方にある場合は先に完了した方のcompletedAtを採用する。
export function mergeProgress(a: Progress, b: Progress): Progress {
  const byDay = new Map<number, DayProgress>()
  for (const entry of [...a.completedDays, ...b.completedDays]) {
    const existing = byDay.get(entry.day)
    if (!existing || entry.completedAt < existing.completedAt) {
      byDay.set(entry.day, entry)
    }
  }
  return {
    completedDays: Array.from(byDay.values()).sort((x, y) => x.day - y.day),
  }
}

// fromには存在するがcomparedToには存在しないDay番号を返す。
// ローカルにのみ残っている完了Dayをクラウドへ反映（プッシュ）する対象を求めるために使う。
export function diffMissingDays(from: Progress, comparedTo: Progress): number[] {
  const existing = new Set(comparedTo.completedDays.map((d) => d.day))
  return from.completedDays.map((d) => d.day).filter((day) => !existing.has(day))
}

// 次に表示すべきDayは「完了済みDayの個数」ではなく、Day1から見て最初に見つかった
// 未完了のDay番号とする。マージ等でcompletedDaysに欠番が生じても、
// 完了済みでないDayへ誤って進めてしまわないようにするため。
export function getNextIncompleteDay(completedDays: DayProgress[]): number {
  const completedSet = new Set(completedDays.map((d) => d.day))
  let day = 1
  while (completedSet.has(day)) {
    day += 1
  }
  return day
}
