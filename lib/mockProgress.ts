import { Progress } from "@/types/progress"

// オフライン・一時キャッシュ用途のローカル保存。正式な進捗元はSupabase
// （lib/progress.ts / actions/progress.ts）であり、ここはその補助のみを担う。
function getProgressKey(studentId: string): string {
  return studentId ? `writing-tower-progress-${studentId}` : ""
}

export function loadProgress(studentId: string): Progress {
  if (typeof window === "undefined") return { completedDays: [] }
  const key = getProgressKey(studentId)
  if (!key) return { completedDays: [] }
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Progress) : { completedDays: [] }
  } catch {
    return { completedDays: [] }
  }
}

export function saveProgress(studentId: string, progress: Progress): void {
  const key = getProgressKey(studentId)
  if (!key) return
  try {
    localStorage.setItem(key, JSON.stringify(progress))
  } catch (err) {
    // localStorageが使えない場合でも致命的ではない（正式な進捗元はSupabase側）が、
    // 原因を追えるよう記録しておく
    console.error("[mockProgress] failed to save local progress cache:", err)
  }
}

export function addCompletedDay(progress: Progress, day: number): Progress {
  if (progress.completedDays.some((d) => d.day === day)) return progress
  return {
    completedDays: [
      ...progress.completedDays,
      { day, completedAt: new Date().toISOString() },
    ],
  }
}
