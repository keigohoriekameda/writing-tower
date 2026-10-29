import { FeedbackErrorBody, FeedbackErrorCode, FeedbackResult } from "@/types/feedback"

export type SubmitFeedbackResult =
  | { ok: true; feedback: FeedbackResult }
  | { ok: false; code: FeedbackErrorCode | "network" | "timeout"; message: string; retryAfterSeconds?: number }

const NETWORK_MESSAGE = "通信できませんでした。インターネット接続を確認して、もう一度お試しください。"
const TIMEOUT_MESSAGE = "AI添削に時間がかかっています。少し待ってからもう一度お試しください。"
const GENERIC_MESSAGE = "AI添削がうまくいきませんでした。もう一度お試しください。"

function isFeedbackResult(value: unknown): value is FeedbackResult {
  const v = value as FeedbackResult | null
  return (
    typeof v === "object" &&
    v !== null &&
    typeof v.praise === "string" &&
    Array.isArray(v.goodPoints) &&
    v.goodPoints.every((p) => typeof p === "string") &&
    typeof v.oneImprovement === "string" &&
    typeof v.example === "string"
  )
}

/**
 * Sends the student's text to /api/feedback with their Supabase access
 * token. Only the lesson id and text are sent — the server derives the
 * user from the verified token.
 */
export async function submitFeedback(
  accessToken: string,
  lessonId: string,
  essay: string,
  timeoutMs = 35_000
): Promise<SubmitFeedbackResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ lessonId, essay }),
      signal: controller.signal,
    })

    let data: unknown = null
    try {
      data = await res.json()
    } catch {
      // fall through to the generic failure below
    }

    if (res.ok) {
      if (isFeedbackResult(data)) return { ok: true, feedback: data }
      return { ok: false, code: "ai_failed", message: GENERIC_MESSAGE }
    }

    const err = (data as FeedbackErrorBody | null)?.error
    if (err && typeof err.code === "string" && typeof err.message === "string") {
      return { ok: false, code: err.code, message: err.message, retryAfterSeconds: err.retryAfterSeconds }
    }
    return { ok: false, code: "service_unavailable", message: GENERIC_MESSAGE }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, code: "timeout", message: TIMEOUT_MESSAGE }
    }
    return { ok: false, code: "network", message: NETWORK_MESSAGE }
  } finally {
    clearTimeout(timer)
  }
}
