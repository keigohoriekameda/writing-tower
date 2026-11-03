import type { ErrorCode, TaskType } from "@/lib/feedback/errorCodes"

export type { ErrorCode, TaskType }

export type WordStatus = "TOO_SHORT" | "IN_RANGE" | "TOO_LONG"

export type ScoreCriterion = "content" | "structure" | "vocabulary" | "grammar"

export type ScoreSummary = {
  /** Always the sum of `breakdown` (computed on the server, never taken from the model). */
  total_score: number
  /** EMAIL: 12 (3 criteria x 4). OPINION: 16 (4 criteria x 4). */
  max_score: number
  breakdown: Partial<Record<ScoreCriterion, number>>
  reasons_ja: Partial<Record<ScoreCriterion, string>>
  /** Fixed server-side text: this is a learning estimate, not an Eiken result. */
  disclaimer_ja: string
}

/** Counted by the server, never by the AI. */
export type WordCountAnalysis = {
  actual_count: number
  min: number
  max: number
  status: WordStatus
}

export type GoodPoint = {
  /** Verbatim from the student's text (verified on the server). */
  original_snippet: string
  explanation_ja: string
}

export type FillBlankPractice = {
  /** One "___" blank inside the student's own sentence. */
  prompt: string
  /** Every accepted answer for the blank (compare case/space-insensitively). */
  acceptable_answers: string[]
  /** The whole corrected sentence, for the student to confirm after answering. */
  completed_sentence: string
}

export type PriorityFeedbackItem = {
  error_code: ErrorCode
  title_ja: string
  explanation_ja: string
  /** Verbatim from the STUDENT's text (verified on the server). */
  original_snippet: string
  /** Verbatim from the TASK / received email (verified), when the problem relates to it. Kept separate from the student's text. */
  task_snippet?: string
  suggested_snippet?: string
  /** Only for "surface" problems, and only when it checks out against the suggestion. */
  fill_blank?: FillBlankPractice
}

export type RevisionStatus = "FIXED" | "PARTLY_FIXED" | "NOT_FIXED"

export type RevisionCheck = {
  error_code: ErrorCode
  status: RevisionStatus
  comment_ja: string
}

export type FeedbackResult = {
  version: 2
  task_type: TaskType
  /** "exam" only for lessons that copy the official exam format; "practice" for the current Day1-30 tasks. */
  rubric: "exam" | "practice"
  overall_comment_ja: string
  score_summary: ScoreSummary
  word_count_analysis: WordCountAnalysis
  good_points: GoodPoint[]
  /** At most 2, most important first. */
  priority_feedback_items: PriorityFeedbackItem[]
  /** Derived on the server from the items and the word count. For a future per-student history; not stored in this version. */
  weakness_tags: string[]
  /** Present only on a re-review of a rewritten answer. */
  revision_check?: RevisionCheck[]

  /** Legacy v1 fields, derived from the above so older callers keep working. */
  praise: string
  goodPoints: string[]
  oneImprovement: string
  example: string
  /** Development-only canned feedback. Never produced in production and never counts as a completed Day. */
  isMock?: boolean
}

export type FeedbackErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "invalid_request"
  | "too_large"
  | "rate_limited"
  | "ai_unavailable"
  | "ai_failed"
  | "service_unavailable"

export type FeedbackErrorBody = {
  error: { code: FeedbackErrorCode; message: string; retryAfterSeconds?: number }
}

/** Sent with a re-review request. Untrusted: the server re-validates every field. */
export type RevisionRequest = {
  previousEssay: string
  previousItems: { error_code: ErrorCode; original_snippet: string }[]
}
