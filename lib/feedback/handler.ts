import type { SupabaseClient } from "@supabase/supabase-js"
import { getLessonById } from "@/data/lessons"
import type { Lesson } from "@/types/lesson"
import type { StudentAccessResult } from "@/lib/auth/session"
import {
  countWords,
  looksLikeEnglish,
  MAX_ESSAY_CHARS,
  MAX_REQUEST_BYTES,
  MAX_REVIEW_WORD_FACTOR,
  MIN_REVIEW_WORDS,
  normalizeForMatch,
  stripControlChars,
  wordStatus,
} from "@/lib/essay"
import { buildMessages, ChatMessage, criteriaFor, taskTypeOf } from "@/lib/feedback/prompt"
import { parseModelFeedback } from "@/lib/feedback/validate"
import { isErrorCode } from "@/lib/feedback/errorCodes"
import type { RevisionRequest, WordCountAnalysis } from "@/types/feedback"
import { getMockFeedback } from "@/lib/feedback/mock"
import { consumeDbQuota, MemoryQuota } from "@/lib/feedback/quota"
import { FeedbackErrorBody, FeedbackErrorCode } from "@/types/feedback"

export type AuthOutcome =
  | { ok: true; userId: string; db: SupabaseClient }
  | { ok: false; status: Exclude<StudentAccessResult["status"], "ok"> }

export type FeedbackDeps = {
  /** Verifies the bearer token with Supabase Auth and checks profile + product access. */
  authenticate: (accessToken: string) => Promise<AuthOutcome>
  /** Returns the model's raw JSON text, or null when the model produced nothing. Throws on transport failure. */
  generate: (messages: ChatMessage[]) => Promise<string | null>
  isAiConfigured: () => boolean
  /** Dev-only escape hatch; always false in production. */
  allowMock: () => boolean
  memoryQuota: MemoryQuota
  /** Lesson lookup; injectable so tests can use an official-format fixture. Defaults to the Day1-30 data. */
  getLesson?: (id: string) => Lesson | undefined
}

const MESSAGES: Record<FeedbackErrorCode, string> = {
  unauthenticated: "ログインの有効期限が切れました。もう一度ログインしてください。",
  forbidden: "このアカウントにはWriting Towerの利用権限がありません。先生にご確認ください。",
  invalid_request: "送信内容を確認できませんでした。英文を見直してもう一度お試しください。",
  too_large: "送信内容が長すぎます。英文を短くしてもう一度お試しください。",
  rate_limited: "短時間にたくさん送信されました。少し待ってからもう一度お試しください。",
  ai_unavailable: "ただいまAI添削を利用できません。時間をおいてもう一度お試しください。",
  ai_failed: "AI添削がうまくいきませんでした。もう一度お試しください。",
  service_unavailable: "サーバーが混み合っています。時間をおいてもう一度お試しください。",
}

const STATUS: Record<FeedbackErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  invalid_request: 400,
  too_large: 413,
  rate_limited: 429,
  ai_unavailable: 503,
  ai_failed: 502,
  service_unavailable: 503,
}

function json(body: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  })
}

function fail(code: FeedbackErrorCode, retryAfterSeconds?: number): Response {
  const body: FeedbackErrorBody = {
    error: { code, message: MESSAGES[code], ...(retryAfterSeconds ? { retryAfterSeconds } : {}) },
  }
  return json(body, STATUS[code], retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : {})
}

function bearerToken(req: Request): string | null {
  const header = req.headers.get("authorization") ?? ""
  const match = /^Bearer\s+([\w-]+\.[\w-]+\.[\w-]+)$/.exec(header.trim())
  return match ? match[1] : null
}

/** Reads at most `max` bytes of the body; returns null if the body is larger. */
async function readLimitedText(req: Request, max: number): Promise<string | null> {
  if (!req.body) return ""
  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > max) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const merged = new Uint8Array(total)
  let offset = 0
  for (const c of chunks) {
    merged.set(c, offset)
    offset += c.byteLength
  }
  return new TextDecoder().decode(merged)
}

/** Validates the client-supplied previous version; returns undefined when absent, "invalid" when malformed. */
function parseRevision(raw: unknown): RevisionRequest | undefined | "invalid" {
  if (raw === undefined || raw === null) return undefined
  if (typeof raw !== "object") return "invalid"
  const { previousEssay, previousItems } = raw as { previousEssay?: unknown; previousItems?: unknown }
  if (typeof previousEssay !== "string" || !Array.isArray(previousItems)) return "invalid"
  const prev = stripControlChars(previousEssay).trim()
  if (prev.length === 0 || prev.length > MAX_ESSAY_CHARS || previousItems.length > 2) return "invalid"
  const items: RevisionRequest["previousItems"] = []
  for (const it of previousItems) {
    const { error_code, original_snippet } = (it ?? {}) as { error_code?: unknown; original_snippet?: unknown }
    if (typeof error_code !== "string" || !isErrorCode(error_code)) return "invalid"
    if (typeof original_snippet !== "string" || original_snippet.length > 300) return "invalid"
    items.push({ error_code, original_snippet: stripControlChars(original_snippet) })
  }
  return { previousEssay: prev, previousItems: items }
}

export async function handleFeedbackRequest(req: Request, deps: FeedbackDeps): Promise<Response> {
  // 1. Cheap rejections first: nothing below runs for oversized or anonymous callers.
  const declaredLength = Number(req.headers.get("content-length") ?? "0")
  if (declaredLength > MAX_REQUEST_BYTES) return fail("too_large")

  const token = bearerToken(req)
  if (!token) return fail("unauthenticated")

  // 2. Identity comes from the verified token only — never from the body.
  const auth = await deps.authenticate(token)
  if (!auth.ok) {
    if (auth.status === "unauthenticated") return fail("unauthenticated")
    if (auth.status === "forbidden") return fail("forbidden")
    return fail("service_unavailable")
  }

  // 3. Body.
  const text = await readLimitedText(req, MAX_REQUEST_BYTES)
  if (text === null) return fail("too_large")

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return fail("invalid_request")
  }
  if (typeof body !== "object" || body === null) return fail("invalid_request")
  const { lessonId, essay: rawEssay, revision: rawRevision } = body as {
    lessonId?: unknown
    essay?: unknown
    revision?: unknown
  }
  if (typeof lessonId !== "string" || typeof rawEssay !== "string") return fail("invalid_request")

  const lesson = (deps.getLesson ?? getLessonById)(lessonId)
  if (!lesson) return fail("invalid_request")

  const essay = stripControlChars(rawEssay).trim()
  if (essay.length > MAX_ESSAY_CHARS) return fail("too_large")
  const wordCount = countWords(essay)
  // Any length with enough words to review is allowed: short / long answers get feedback
  // (and a word-count notice) instead of a bare rejection. Day completion is decided
  // from the status the client receives, not here.
  if (wordCount < MIN_REVIEW_WORDS || wordCount > lesson.wordCount.max * MAX_REVIEW_WORD_FACTOR) {
    return fail("invalid_request")
  }
  if (!looksLikeEnglish(essay)) return fail("invalid_request")

  const revision = parseRevision(rawRevision)
  if (revision === "invalid") return fail("invalid_request")
  // Re-reviewing an unchanged answer would only spend quota: refuse before any AI call.
  if (revision && normalizeForMatch(revision.previousEssay) === normalizeForMatch(essay)) {
    return fail("invalid_request")
  }

  const words: WordCountAnalysis = {
    actual_count: wordCount,
    min: lesson.wordCount.min,
    max: lesson.wordCount.max,
    status: wordStatus(wordCount, lesson.wordCount.min, lesson.wordCount.max),
  }

  // 4. Is there any way to answer at all? (Checked before quota so a
  // misconfigured deploy doesn't burn students' allowance.)
  const aiConfigured = deps.isAiConfigured()
  if (!aiConfigured && !deps.allowMock()) return fail("ai_unavailable")

  // 5. Quota: per-instance burst/concurrency guard, then the shared DB quota.
  const local = deps.memoryQuota.tryAcquire(auth.userId)
  if (!local.allowed) return fail("rate_limited", local.retryAfterSeconds)

  try {
    const db = await consumeDbQuota(auth.db)
    if (db.kind === "error") return fail("service_unavailable")
    if (db.kind === "decision") {
      const decision = db.decision
      if (!decision.allowed) return fail("rate_limited", decision.retryAfterSeconds)
    }
    if (db.kind === "unavailable") {
      console.warn("[writing-tower] wt_consume_feedback_quota is not deployed; using per-instance limits only")
    }

    // 6. Feedback.
    if (!aiConfigured) return json(getMockFeedback(lesson, essay), 200)

    let raw: string | null
    try {
      raw = await deps.generate(buildMessages(lesson, essay, words, revision ?? undefined))
    } catch (err) {
      console.error("[writing-tower] AI request failed", err instanceof Error ? err.name : "unknown")
      return fail("ai_failed")
    }
    if (!raw) return fail("ai_failed")

    const task = taskTypeOf(lesson)
    const parsed = parseModelFeedback(raw, {
      task,
      exam: lesson.examFormat === true,
      essay,
      taskText: lesson.prompt,
      words,
      criteria: criteriaFor(task),
      previousCodes: revision ? revision.previousItems.map((i) => i.error_code) : undefined,
    })
    if (!parsed.ok) {
      console.error("[writing-tower] AI response rejected:", parsed.reason)
      return fail("ai_failed")
    }
    if (parsed.dropped > 0) console.warn(`[writing-tower] ${parsed.dropped} unverifiable AI item(s) dropped`)
    return json(parsed.feedback, 200)
  } finally {
    deps.memoryQuota.release(auth.userId)
  }
}
