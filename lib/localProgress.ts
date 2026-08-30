import { Progress } from "@/types/progress"

function progressKey(loginId: string): string {
  return `writing-tower-progress-${loginId}`
}

/**
 * Offline/local cache only — Supabase is the source of truth. Kept so the
 * app still shows something useful without network, and so progress a
 * student built up before the Supabase migration (or while offline) can
 * be rescued and merged into the cloud on next successful login.
 */
export function loadLocalProgress(loginId: string): Progress {
  if (typeof window === "undefined") return { completedDays: [] }
  try {
    const raw = localStorage.getItem(progressKey(loginId))
    return raw ? (JSON.parse(raw) as Progress) : { completedDays: [] }
  } catch {
    return { completedDays: [] }
  }
}

export function saveLocalProgress(loginId: string, progress: Progress): void {
  try {
    localStorage.setItem(progressKey(loginId), JSON.stringify(progress))
  } catch (err) {
    console.error("[writing-tower] failed to write local progress cache", err)
  }
}

export function addCompletedDay(progress: Progress, day: number): Progress {
  if (progress.completedDays.some((d) => d.day === day)) return progress
  return {
    completedDays: [...progress.completedDays, { day, completedAt: new Date().toISOString() }],
  }
}

/**
 * Union of two progress sets, keyed by day — never drops a completed day
 * from either side. This is the merge rule requested for the Supabase
 * migration: progress must never regress, whichever side (cloud or local
 * cache) is "ahead" always wins for the days only it has.
 */
export function unionProgress(a: Progress, b: Progress): Progress {
  const byDay = new Map<number, { day: number; completedAt: string }>()
  for (const entry of a.completedDays) byDay.set(entry.day, entry)
  for (const entry of b.completedDays) {
    const existing = byDay.get(entry.day)
    if (!existing || new Date(entry.completedAt).getTime() < new Date(existing.completedAt).getTime()) {
      byDay.set(entry.day, entry)
    }
  }
  return { completedDays: Array.from(byDay.values()).sort((x, y) => x.day - y.day) }
}
