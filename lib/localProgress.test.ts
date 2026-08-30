import { describe, expect, it } from "vitest"
import { Progress } from "@/types/progress"
import { addCompletedDay, unionProgress } from "@/lib/localProgress"
import { getNextIncompleteDay } from "@/lib/progressSelectors"

function mk(days: number[]): Progress {
  return { completedDays: days.map((day) => ({ day, completedAt: new Date().toISOString() })) }
}

function daysOf(progress: Progress): number[] {
  return progress.completedDays.map((d) => d.day).sort((a, b) => a - b)
}

// Mirrors the exact computation useProgress's init effect uses after
// merging, to decide which days are missing from the cloud and need to be
// pushed via wt_complete_day. Kept in lockstep with hooks/useProgress.ts.
function daysMissingFromCloud(cloud: Progress, merged: Progress): number[] {
  return daysOf({
    completedDays: merged.completedDays.filter(
      (day) => !cloud.completedDays.some((c) => c.day === day.day)
    ),
  })
}

describe("unionProgress", () => {
  it("never regresses when local cache is behind the cloud (scenario F)", () => {
    // Cloud already has Day1-3; a stale/old local cache only has Day1
    // (e.g. localStorage from before the student's other 2 completions
    // synced on a different device, or manually rolled back for testing).
    const cloud = mk([1, 2, 3])
    const local = mk([1])

    const merged = unionProgress(cloud, local)

    // The cloud's days must all survive the merge — none dropped.
    expect(daysOf(merged)).toEqual([1, 2, 3])
    // And nothing needs to be (re-)pushed to the cloud: the local cache
    // being behind must never trigger a write that could race a more
    // up-to-date cloud value.
    expect(daysMissingFromCloud(cloud, merged)).toEqual([])
  })

  it("rescues days the local cache has that the cloud doesn't (scenario E)", () => {
    const cloud = mk([1, 2, 3])
    const local = mk([1, 2, 3, 4, 5])

    const merged = unionProgress(cloud, local)

    expect(daysOf(merged)).toEqual([1, 2, 3, 4, 5])
    // Only the genuinely new days get pushed up — the ones the cloud
    // already had are left alone.
    expect(daysMissingFromCloud(cloud, merged)).toEqual([4, 5])
  })

  it("is symmetric: which side is 'cloud' vs 'local' never changes the result set", () => {
    const a = mk([1, 3, 5])
    const b = mk([2, 3, 4])

    expect(daysOf(unionProgress(a, b))).toEqual([1, 2, 3, 4, 5])
    expect(daysOf(unionProgress(b, a))).toEqual([1, 2, 3, 4, 5])
  })

  it("is a no-op when both sides already match", () => {
    const cloud = mk([1, 2])
    const local = mk([1, 2])

    const merged = unionProgress(cloud, local)

    expect(daysOf(merged)).toEqual([1, 2])
    expect(daysMissingFromCloud(cloud, merged)).toEqual([])
  })
})

describe("addCompletedDay", () => {
  it("adds a new day", () => {
    const next = addCompletedDay(mk([1]), 2)
    expect(daysOf(next)).toEqual([1, 2])
  })

  it("is idempotent — completing an already-completed day changes nothing", () => {
    const progress = mk([1, 2])
    const next = addCompletedDay(progress, 2)
    expect(next).toBe(progress) // same reference: no-op, not just equal content
  })
})

describe("getNextIncompleteDay", () => {
  it("returns Day 1 for a brand-new student", () => {
    expect(getNextIncompleteDay(mk([]))).toBe(1)
  })

  it("returns the day after the last contiguous completion", () => {
    expect(getNextIncompleteDay(mk([1, 2, 3, 4]))).toBe(5)
  })

  it("is gap-safe: does not skip over a missing day just because a later one is completed", () => {
    // e.g. Day2 never synced for some reason, but Day3 did.
    expect(getNextIncompleteDay(mk([1, 3]))).toBe(2)
  })
})
