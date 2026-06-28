import { Progress } from "@/types/progress"

const STUDENT_ID_KEY = "writing-tower-student-id"

function getProgressKey(): string {
  const studentId = localStorage.getItem(STUDENT_ID_KEY)
  return studentId ? `writing-tower-progress-${studentId}` : ""
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { completedDays: [] }
  const key = getProgressKey()
  if (!key) return { completedDays: [] }
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Progress) : { completedDays: [] }
  } catch {
    return { completedDays: [] }
  }
}

export function saveProgress(progress: Progress): void {
  const key = getProgressKey()
  if (!key) return
  try {
    localStorage.setItem(key, JSON.stringify(progress))
  } catch {
    // localStorage may be unavailable (private browsing, storage full, etc.)
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
