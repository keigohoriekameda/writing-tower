import { describe, expect, it, vi } from "vitest"
import { ProgressSync, CloudApi, LocalStore } from "@/lib/progress/sync"
import { Progress } from "@/types/progress"
import { sanitizeProgress } from "@/lib/localProgress"

const day = (n: number, at = "2026-01-01T00:00:00.000Z") => ({ day: n, completedAt: at })

function memStore(initial: Progress = { completedDays: [] }): LocalStore & { data: Progress } {
  const s = { data: initial, load: () => s.data, save: (p: Progress) => void (s.data = p) }
  return s
}

function fakeCloud(initial: number[] = []) {
  const rows = new Set(initial)
  const api = {
    rows,
    fail: false,
    getProgress: vi.fn(async () => {
      if (api.fail) throw new Error("offline")
      return { completedDays: [...rows].map((d) => day(d)) }
    }),
    completeDay: vi.fn(async (d: number) => {
      if (api.fail) throw new Error("offline")
      rows.add(d)
    }),
  }
  return api satisfies CloudApi & { rows: Set<number>; fail: boolean }
}

const days = (s: ProgressSync) => s.getSnapshot().progress.completedDays.map((d) => d.day)

describe("ProgressSync", () => {
  it("restores cloud progress on a new device with empty local storage", async () => {
    const cloud = fakeCloud([1, 2, 3])
    const sync = new ProgressSync(cloud, memStore())
    await sync.load()
    expect(days(sync)).toEqual([1, 2, 3])
    expect(cloud.completeDay).not.toHaveBeenCalled()
  })

  it("pushes days that only exist locally and never removes cloud days", async () => {
    const cloud = fakeCloud([1, 2])
    const sync = new ProgressSync(cloud, memStore({ completedDays: [day(3)] }))
    await sync.load()
    expect(days(sync)).toEqual([1, 2, 3])
    expect(cloud.rows.has(3)).toBe(true)
  })

  it("keeps the local cache when the cloud is unreachable and reports it", async () => {
    const cloud = fakeCloud()
    cloud.fail = true
    const sync = new ProgressSync(cloud, memStore({ completedDays: [day(1)] }))
    await sync.load()
    expect(days(sync)).toEqual([1])
    expect(sync.getSnapshot().status).toBe("loadFailed")
  })

  it("keeps a completed day locally on save failure and resyncs it later", async () => {
    const cloud = fakeCloud([1])
    const store = memStore()
    const sync = new ProgressSync(cloud, store)
    await sync.load()
    cloud.fail = true
    expect(await sync.complete(2)).toBe(false)
    expect(days(sync)).toEqual([1, 2])
    expect(store.data.completedDays.map((d) => d.day)).toEqual([1, 2])
    expect(sync.getSnapshot().status).toBe("saveFailed")

    cloud.fail = false
    await sync.resync()
    expect(cloud.rows.has(2)).toBe(true)
    expect(sync.getSnapshot().status).toBe("ok")
  })

  it("does not record a day twice: repeated and concurrent completions send one request", async () => {
    const cloud = fakeCloud()
    const sync = new ProgressSync(cloud, memStore())
    await sync.load()
    await Promise.all([sync.complete(4), sync.complete(4), sync.complete(4)])
    await sync.complete(4)
    expect(cloud.completeDay).toHaveBeenCalledTimes(1)
    expect(days(sync)).toEqual([4])
  })

  it("does not lose a completion made while the initial load is still in flight", async () => {
    const cloud = fakeCloud([1])
    let release!: () => void
    const gate = new Promise<void>((r) => (release = r))
    const original = cloud.getProgress.getMockImplementation()!
    cloud.getProgress.mockImplementation(async () => {
      await gate
      return original()
    })
    const store = memStore()
    const sync = new ProgressSync(cloud, store)
    const loading = sync.load()
    const completing = sync.complete(2)
    release()
    await Promise.all([loading, completing])
    expect(days(sync)).toEqual([1, 2])
    expect(store.data.completedDays.map((d) => d.day)).toEqual([1, 2])
    expect(cloud.completeDay).toHaveBeenCalledTimes(1)
  })

  it("keeps two students isolated (separate instances, separate stores)", async () => {
    const a = new ProgressSync(fakeCloud([1, 2]), memStore())
    const b = new ProgressSync(fakeCloud([5]), memStore())
    await Promise.all([a.load(), b.load()])
    expect(days(a)).toEqual([1, 2])
    expect(days(b)).toEqual([5])
  })

  it("retries a failed initial load on resync", async () => {
    const cloud = fakeCloud([1])
    cloud.fail = true
    const sync = new ProgressSync(cloud, memStore())
    await sync.load()
    cloud.fail = false
    await sync.resync()
    expect(days(sync)).toEqual([1])
    expect(sync.getSnapshot().status).toBe("ok")
  })
})

describe("sanitizeProgress", () => {
  it("drops malformed entries and duplicates, keeps valid ones", () => {
    const out = sanitizeProgress({
      completedDays: [day(2), { day: "x", completedAt: "2026-01-01" }, { day: 0, completedAt: "2026-01-01" }, day(2), { day: 3, completedAt: "bad" }, null, day(1)],
    })
    expect(out.completedDays.map((d) => d.day)).toEqual([1, 2])
  })
  it("tolerates non-objects", () => {
    expect(sanitizeProgress("oops").completedDays).toEqual([])
    expect(sanitizeProgress(null).completedDays).toEqual([])
  })
})

describe("ProgressSync status stability", () => {
  it("does not hide a save failure while a retry is still in flight (no banner flicker)", async () => {
    const cloud = fakeCloud([1])
    const sync = new ProgressSync(cloud, memStore())
    const seen: string[] = []
    sync.subscribe(() => seen.push(sync.getSnapshot().status))
    // First push fails immediately; a second push (e.g. the load-time flush) is still pending when it settles.
    let releaseSecond!: () => void
    const second = new Promise<void>((r) => (releaseSecond = r))
    cloud.completeDay.mockImplementationOnce(async () => { throw new Error("offline") })
    cloud.completeDay.mockImplementationOnce(async () => { await second; throw new Error("offline") })
    const first = sync.complete(5)
    await first
    const retry = sync.resync() // starts a second push for day 5 and hangs
    await new Promise((r) => setTimeout(r, 0))
    releaseSecond()
    await retry
    const firstFailure = seen.indexOf("saveFailed")
    expect(firstFailure).toBeGreaterThanOrEqual(0)
    expect(seen.slice(firstFailure).every((s) => s === "saveFailed")).toBe(true)
    expect(sync.getSnapshot().status).toBe("saveFailed")
  })
})

describe("ProgressSync sharing", () => {
  it("ensureLoaded reads the cloud once however many components ask, and retries after a failed load", async () => {
    const cloud = fakeCloud([1, 2])
    const sync = new ProgressSync(cloud, memStore())
    await Promise.all([sync.ensureLoaded(), sync.ensureLoaded(), sync.ensureLoaded()])
    await sync.ensureLoaded()
    expect(cloud.getProgress).toHaveBeenCalledTimes(1)

    const flaky = fakeCloud([1])
    flaky.fail = true
    const s2 = new ProgressSync(flaky, memStore())
    await s2.ensureLoaded()
    expect(s2.getSnapshot().status).toBe("loadFailed")
    flaky.fail = false
    await s2.ensureLoaded()
    expect(days(s2)).toEqual([1])
    expect(s2.getSnapshot().status).toBe("ok")
  })

  it("a day already confirmed by the cloud is never sent again by a later screen", async () => {
    const cloud = fakeCloud([6])
    const sync = new ProgressSync(cloud, memStore())
    await sync.ensureLoaded()
    await sync.complete(6) // e.g. the re-review screen mounting
    expect(cloud.completeDay).not.toHaveBeenCalled()
  })
})

import { clearProgressSyncs, getProgressSync } from "@/lib/progress/registry"
describe("progress registry", () => {
  it("shares one instance per student, separates students, and forgets everything on sign-out", () => {
    clearProgressSyncs()
    const mk = () => new ProgressSync(fakeCloud(), memStore())
    const a1 = getProgressSync("a", mk)
    expect(getProgressSync("a", mk)).toBe(a1)
    expect(getProgressSync("b", mk)).not.toBe(a1)
    clearProgressSyncs()
    expect(getProgressSync("a", mk)).not.toBe(a1)
  })
})

describe("ProgressSync does not raise a false save-failure alarm", () => {
  it("completing a day before the initial load finishes never shows saveFailed when the cloud is fine", async () => {
    const cloud = fakeCloud([1, 2])
    const store = memStore({ completedDays: [day(1), day(2)] })
    const sync = new ProgressSync(cloud, store)
    const seen: string[] = []
    sync.subscribe(() => seen.push(sync.getSnapshot().status))
    const loading = sync.ensureLoaded()
    await sync.complete(6) // the review screen mounting right away
    await loading
    expect(seen.every((s) => s === "ok")).toBe(true)
    expect(sync.getSnapshot().status).toBe("ok")
    expect(days(sync)).toEqual([1, 2, 6])
  })
})

describe("ProgressSync load/complete race", () => {
  it("a save that finishes while an older cloud read is in flight is not sent again", async () => {
    const cloud = fakeCloud([1])
    let releaseRead!: () => void
    const readGate = new Promise<void>((r) => (releaseRead = r))
    const original = cloud.getProgress.getMockImplementation()!
    // the read is taken BEFORE day 6 reaches the cloud, then delivered late
    cloud.getProgress.mockImplementation(async () => {
      const snapshot = await original()
      await readGate
      return snapshot
    })
    const sync = new ProgressSync(cloud, memStore())
    const loading = sync.ensureLoaded()
    await sync.complete(6) // saved and confirmed while the read is still pending
    releaseRead()
    await loading
    expect(cloud.completeDay).toHaveBeenCalledTimes(1)
  })
})
