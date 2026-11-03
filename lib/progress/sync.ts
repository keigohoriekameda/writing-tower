import { Progress } from "@/types/progress"
import { addCompletedDay, unionProgress } from "@/lib/localProgress"

export type CloudApi = {
  getProgress: () => Promise<Progress>
  completeDay: (day: number) => Promise<void>
}

export type LocalStore = {
  load: () => Progress
  save: (progress: Progress) => void
}

/** "loadFailed": cloud unreachable on load (showing the local cache). "saveFailed": some day isn't in the cloud yet. */
export type SyncStatus = "ok" | "loadFailed" | "saveFailed"

export type SyncSnapshot = { progress: Progress; status: SyncStatus }

/**
 * Per-student progress state: cloud (Supabase) is the source of truth, the
 * local cache is a fallback. One instance serves exactly one student —
 * create a new one when the account changes so progress can't mix.
 *
 * Guarantees:
 * - a day is never dropped from memory/local cache because of a load or
 *   sync failure; it stays queued until the cloud confirms it
 * - completing the same day repeatedly (double render, double click,
 *   concurrent load-time sync) sends at most one request at a time and none
 *   once the cloud has confirmed it
 * - a completion that happens while the initial load is still in flight is
 *   merged in, never overwritten by the load result
 */
export class ProgressSync {
  private progress: Progress = { completedDays: [] }
  private status: SyncStatus = "ok"
  private confirmed = new Set<number>()
  private inflight = new Map<number, Promise<boolean>>()
  /** Days whose last cloud save attempt failed. Only these count as a save failure. */
  private failed = new Set<number>()
  private loaded = false
  private loading: Promise<void> | undefined
  private listeners = new Set<() => void>()
  private snapshot: SyncSnapshot = { progress: this.progress, status: this.status }

  constructor(
    private cloud: CloudApi,
    private store: LocalStore
  ) {
    this.progress = store.load()
    this.snapshot = { progress: this.progress, status: this.status }
  }

  getSnapshot = (): SyncSnapshot => this.snapshot

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private publish(): void {
    this.snapshot = { progress: this.progress, status: this.status }
    for (const l of this.listeners) l()
  }

  private setProgress(next: Progress): void {
    if (next === this.progress) return
    this.progress = next
    this.store.save(next)
  }

  /** Loads once; concurrent callers share the request, and a failed load can be retried by calling again. */
  ensureLoaded(): Promise<void> {
    if (!this.loading) {
      this.loading = this.load().finally(() => {
        if (!this.loaded) this.loading = undefined
      })
    }
    return this.loading
  }

  /** Initial load: restores progress from the cloud (e.g. first login on another device) and pushes up anything only held locally. */
  async load(): Promise<void> {
    let cloud: Progress
    try {
      cloud = await this.cloud.getProgress()
    } catch (err) {
      console.error("[writing-tower] failed to load cloud progress", err)
      this.status = "loadFailed"
      this.publish()
      return
    }

    // Add to, never replace: a day confirmed by a save that finished while this (older)
    // read was in flight must stay confirmed, or it would be sent a second time.
    for (const d of cloud.completedDays) this.confirmed.add(d.day)
    this.loaded = true
    // this.progress already contains the local cache plus any completion
    // made while we were waiting; the cloud only ever adds to it.
    this.setProgress(unionProgress(cloud, this.progress))
    // A successful load clears "loadFailed", but must not hide an earlier
    // "saveFailed" (days still waiting for the cloud) — the flush below
    // settles that.
    if (this.status === "loadFailed") this.status = "ok"
    this.publish()
    await this.flush()
  }

  /** Marks a day complete. Resolves true once the cloud has it, false if it is only saved on this device for now. */
  async complete(day: number): Promise<boolean> {
    this.setProgress(addCompletedDay(this.progress, day))
    this.publish()
    return this.push(day)
  }

  /** Retry everything that isn't in the cloud yet (or reload, if the first load failed). */
  async resync(): Promise<void> {
    if (!this.loaded) {
      await this.load()
      return
    }
    await this.flush()
  }

  private async flush(): Promise<void> {
    for (const entry of this.progress.completedDays) {
      await this.push(entry.day)
    }
  }

  private push(day: number): Promise<boolean> {
    if (this.confirmed.has(day)) return Promise.resolve(true)
    const existing = this.inflight.get(day)
    if (existing) return existing

    const request = (async () => {
      try {
        await this.cloud.completeDay(day)
        this.confirmed.add(day)
        this.failed.delete(day)
        return true
      } catch (err) {
        console.error(`[writing-tower] failed to save Day ${day} to Supabase`, err)
        this.failed.add(day)
        return false
      } finally {
        this.inflight.delete(day)
        this.refreshStatus()
      }
    })()
    this.inflight.set(day, request)
    return request
  }

  private refreshStatus(): void {
    if (this.status === "loadFailed") return
    // A day that simply hasn't been sent yet (e.g. the initial load is still
    // running) is not a failure; only a failed attempt is. While a retry is
    // in flight the outcome is unknown: keep showing the current status
    // instead of flickering the banner away.
    if (this.failed.size > 0 && this.inflight.size > 0) return
    const next: SyncStatus = this.failed.size > 0 ? "saveFailed" : "ok"
    if (next !== this.status) {
      this.status = next
      this.publish()
    }
  }
}
