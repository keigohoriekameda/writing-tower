import { Progress } from "@/types/progress"

const STORAGE_KEY = "writing-tower-progress"

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { completedDays: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Progress) : { completedDays: [] }
  } catch {
    return { completedDays: [] }
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
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
