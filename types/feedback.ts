export type FeedbackResult = {
  praise: string
  goodPoints: string[]
  oneImprovement: string
  example: string
  /** A short verbatim quote from the student's own text that the feedback is grounded in. */
  evidence?: string
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
