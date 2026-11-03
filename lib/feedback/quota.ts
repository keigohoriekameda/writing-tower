import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Per-student limits for the AI feedback endpoint. The authoritative copy
 * lives in the `wt_consume_feedback_quota` RPC (see
 * supabase/migrations/20260901000100_wt_feedback_quota.sql); these values
 * are used by the per-instance fallback and must be kept in sync with it.
 */
export const QUOTA = {
  minIntervalSeconds: 5,
  perHour: 20,
  perDay: 60,
} as const

export type QuotaDecision =
  | { allowed: true }
  | { allowed: false; reason: "too_fast" | "hourly" | "daily" | "busy"; retryAfterSeconds: number }

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

/**
 * Best-effort limiter held in process memory. It is NOT a substitute for
 * the DB quota (serverless instances don't share memory), but it stops
 * rapid bursts and concurrent in-flight requests on a warm instance, and
 * keeps a floor of protection if the DB migration has not been applied.
 */
export class MemoryQuota {
  private hits = new Map<string, number[]>()
  private inflight = new Set<string>()

  constructor(private now: () => number = Date.now) {}

  /** Records an attempt if allowed. Callers must call release() when the request finishes. */
  tryAcquire(userId: string): QuotaDecision {
    const now = this.now()
    if (this.inflight.has(userId)) return { allowed: false, reason: "busy", retryAfterSeconds: 3 }

    const recent = (this.hits.get(userId) ?? []).filter((t) => now - t < DAY_MS)
    const last = recent[recent.length - 1]
    if (last !== undefined && now - last < QUOTA.minIntervalSeconds * 1000) {
      return {
        allowed: false,
        reason: "too_fast",
        retryAfterSeconds: Math.ceil((QUOTA.minIntervalSeconds * 1000 - (now - last)) / 1000),
      }
    }
    const inHour = recent.filter((t) => now - t < HOUR_MS)
    if (inHour.length >= QUOTA.perHour) {
      return {
        allowed: false,
        reason: "hourly",
        retryAfterSeconds: Math.ceil((HOUR_MS - (now - inHour[0])) / 1000),
      }
    }
    if (recent.length >= QUOTA.perDay) {
      return {
        allowed: false,
        reason: "daily",
        retryAfterSeconds: Math.ceil((DAY_MS - (now - recent[0])) / 1000),
      }
    }

    recent.push(now)
    this.hits.set(userId, recent)
    this.inflight.add(userId)
    if (this.hits.size > 5000) this.prune(now)
    return { allowed: true }
  }

  release(userId: string): void {
    this.inflight.delete(userId)
  }

  private prune(now: number): void {
    for (const [id, times] of this.hits) {
      if (times.every((t) => now - t >= DAY_MS)) this.hits.delete(id)
    }
  }
}

export type DbQuotaOutcome =
  | { kind: "decision"; decision: QuotaDecision }
  | { kind: "unavailable" } // RPC not deployed yet (migration not applied)
  | { kind: "error" }

/**
 * Consumes one unit of the caller's server-side quota via the
 * `wt_consume_feedback_quota` RPC. The RPC derives the user from the JWT
 * (`auth.uid()`), so nothing client-supplied is trusted.
 */
export async function consumeDbQuota(db: SupabaseClient): Promise<DbQuotaOutcome> {
  const { data, error } = await db.rpc("wt_consume_feedback_quota")
  if (error) {
    // PGRST202 = PostgREST can't find the function; 42883 = undefined_function.
    if (error.code === "PGRST202" || error.code === "42883") return { kind: "unavailable" }
    console.error("[writing-tower] quota RPC failed", error.code)
    return { kind: "error" }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row || typeof row.allowed !== "boolean") return { kind: "error" }
  if (row.allowed) return { kind: "decision", decision: { allowed: true } }
  const reason = row.reason === "hourly" || row.reason === "daily" ? row.reason : "too_fast"
  return {
    kind: "decision",
    decision: {
      allowed: false,
      reason,
      retryAfterSeconds: Math.max(1, Number(row.retry_after_seconds) || QUOTA.minIntervalSeconds),
    },
  }
}
