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
