import { z } from "zod"
import {
  FeedbackResult,
  GoodPoint,
  PriorityFeedbackItem,
  RevisionCheck,
  ScoreCriterion,
  WordCountAnalysis,
} from "@/types/feedback"
import { looksLikeEnglish, normalizeForMatch } from "@/lib/essay"
import { normalizeAnswer } from "@/lib/blank"
import { codeAllowed, codeKind, codeRank, ErrorCode, isErrorCode, TaskType, weaknessTag } from "@/lib/feedback/errorCodes"
import { validateFillBlank } from "@/lib/feedback/fillBlank"

export const SCORE_DISCLAIMER_JA =
  "学習用の推定スコアです。英検の本当の得点や合否を示すものではありません。AIの採点には多少のゆれがあります。"

export const MAX_PRIORITY_ITEMS = 2
const MAX_GOOD_POINTS = 3

const JAPANESE = /[぀-ヿ㐀-鿿]/
const ja = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((s) => JAPANESE.test(s), "must be Japanese")

const score = z.number().int().min(0).max(4)

/** Shape check only; per-item content checks happen below so one bad item doesn't discard the whole review. */
const TopSchema = z.object({
  overall_comment_ja: ja(240),
  scores: z.record(z.string(), z.unknown()),
  score_reasons_ja: z.record(z.string(), z.unknown()),
  good_points: z.array(z.unknown()).max(8),
  priority_feedback_items: z.array(z.unknown()).max(8),
  revision_check: z.array(z.unknown()).max(8).optional(),
})

const GoodPointSchema = z.object({
  original_snippet: z.string().trim().min(2).max(300),
  explanation_ja: ja(240),
})

const ItemSchema = z.object({
  error_code: z.string(),
  title_ja: ja(60),
  explanation_ja: ja(400),
  original_snippet: z.string().trim().min(2).max(300),
  task_snippet: z.string().trim().max(300).nullish(),
  suggested_snippet: z.string().trim().max(300).nullish(),
  fill_blank: z.unknown().optional(),
})

const RevisionSchema = z.object({
  error_code: z.string(),
  status: z.enum(["FIXED", "PARTLY_FIXED", "NOT_FIXED"]),
  comment_ja: ja(240),
})

export type ParseContext = {
  task: TaskType
  exam: boolean
  essay: string
  /** The task / received-email text the model was shown. */
  taskText: string
  words: WordCountAnalysis
  criteria: readonly ScoreCriterion[]
  /** Present on a re-review: the problems the student was asked to fix. */
  previousCodes?: ErrorCode[]
}

export type ParseResult =
  | { ok: true; feedback: FeedbackResult; dropped: number }
  | { ok: false; reason: string }

const CONNECTOR_LEAD =
  /^(firstly|first|secondly|second|thirdly|third|also|in addition|furthermore|for example|for instance|finally|lastly)\s*/

/** True when the "correction" changes nothing, or only swaps one acceptable connector for another. */
function isNoOpChange(original: string, suggested: string): boolean {
  const a = normalizeAnswer(original)
  const b = normalizeAnswer(suggested)
  if (a === b) return true
  return a.replace(CONNECTOR_LEAD, "") === b.replace(CONNECTOR_LEAD, "")
}

const inText = (haystack: string, needle: string) => normalizeForMatch(haystack).includes(normalizeForMatch(needle))

export function parseModelFeedback(raw: string, ctx: ParseContext): ParseResult {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { ok: false, reason: "not_json" }
  }

  const top = TopSchema.safeParse(json)
  if (!top.success) return { ok: false, reason: `schema:${top.error.issues[0]?.path.join(".") ?? "?"}` }
  const data = top.data

  // --- scores: required criteria, integers 0-4; the total is computed here, never read from the model
  const breakdown: Partial<Record<ScoreCriterion, number>> = {}
  const reasons: Partial<Record<ScoreCriterion, string>> = {}
  for (const c of ctx.criteria) {
    const s = score.safeParse(data.scores[c])
    if (!s.success) return { ok: false, reason: `score:${c}` }
    const r = ja(240).safeParse(data.score_reasons_ja[c])
    if (!r.success) return { ok: false, reason: `reason:${c}` }
    breakdown[c] = s.data
    reasons[c] = r.data
  }
  const total = ctx.criteria.reduce((sum, c) => sum + (breakdown[c] ?? 0), 0)
  const max = ctx.criteria.length * 4

  // --- good points: quotes must really be in the student's text
  const goodRaw = data.good_points
  const good: GoodPoint[] = []
  let dropped = 0
  for (const g of goodRaw) {
    const p = GoodPointSchema.safeParse(g)
    if (p.success && inText(ctx.essay, p.data.original_snippet) && good.length < MAX_GOOD_POINTS) {
      good.push({ original_snippet: p.data.original_snippet, explanation_ja: p.data.explanation_ja })
    } else dropped++
  }
  // The model claimed strengths but none can be verified: don't show an unverifiable review.
  if (goodRaw.length > 0 && good.length === 0) return { ok: false, reason: "good_points_not_in_essay" }

  // --- priority items: keep only real, verifiable, allowed ones
  const items: PriorityFeedbackItem[] = []
  const seen = new Set<string>()
  for (const rawItem of data.priority_feedback_items) {
    const p = ItemSchema.safeParse(rawItem)
    if (!p.success) { dropped++; continue }
    const it = p.data
    if (!isErrorCode(it.error_code) || !codeAllowed(it.error_code, ctx.task, ctx.exam)) { dropped++; continue }
    const code = it.error_code
    if (!inText(ctx.essay, it.original_snippet)) { dropped++; continue } // hallucinated / not the student's words
    const key = normalizeForMatch(it.original_snippet)
    if (seen.has(key)) { dropped++; continue }

    let suggested = it.suggested_snippet?.trim() || undefined
    if (suggested && !looksLikeEnglish(suggested)) suggested = undefined
    if (codeKind(code) === "surface") {
      if (!suggested) { dropped++; continue } // a form problem needs a concrete fix
    }
    if (suggested && isNoOpChange(it.original_snippet, suggested)) { dropped++; continue } // fake improvement

    let taskSnippet = it.task_snippet?.trim() || undefined
    if (taskSnippet && !inText(ctx.taskText, taskSnippet)) taskSnippet = undefined

    const fillBlank =
      codeKind(code) === "surface" && suggested
        ? validateFillBlank(it.fill_blank, it.original_snippet, suggested)
        : undefined

    seen.add(key)
    items.push({
      error_code: code,
      title_ja: it.title_ja,
      explanation_ja: it.explanation_ja,
      original_snippet: it.original_snippet,
      ...(taskSnippet ? { task_snippet: taskSnippet } : {}),
      ...(suggested ? { suggested_snippet: suggested } : {}),
      ...(fillBlank ? { fill_blank: fillBlank } : {}),
    })
  }
  // Meaning problems before form problems; stable within a rank.
  const ranked = items
    .map((it, i) => ({ it, i }))
    .sort((a, b) => codeRank(a.it.error_code) - codeRank(b.it.error_code) || a.i - b.i)
    .map((x) => x.it)
  dropped += Math.max(0, ranked.length - MAX_PRIORITY_ITEMS)
  const priority = ranked.slice(0, MAX_PRIORITY_ITEMS)

  // --- re-review: only entries for the problems we actually asked about
  let revisionCheck: RevisionCheck[] | undefined
  if (ctx.previousCodes) {
    revisionCheck = []
    for (const r of data.revision_check ?? []) {
      const p = RevisionSchema.safeParse(r)
      if (!p.success || !isErrorCode(p.data.error_code)) continue
      const code = p.data.error_code
      if (!ctx.previousCodes.includes(code) || revisionCheck.some((x) => x.error_code === code)) continue
      revisionCheck.push({ error_code: code, status: p.data.status, comment_ja: p.data.comment_ja })
    }
  }

  const tags = new Set<string>(priority.map((i) => weaknessTag(i.error_code)))
  for (const r of revisionCheck ?? []) if (r.status !== "FIXED") tags.add(weaknessTag(r.error_code))
  if (ctx.words.status === "TOO_SHORT") tags.add("WORD_COUNT_SHORT")
  if (ctx.words.status === "TOO_LONG") tags.add("WORD_COUNT_LONG")

  const feedback: FeedbackResult = {
    version: 2,
    task_type: ctx.task,
    rubric: ctx.exam ? "exam" : "practice",
    overall_comment_ja: data.overall_comment_ja,
    score_summary: {
      total_score: total,
      max_score: max,
      breakdown,
      reasons_ja: reasons,
      disclaimer_ja: SCORE_DISCLAIMER_JA,
    },
    word_count_analysis: ctx.words,
    good_points: good,
    priority_feedback_items: priority,
    weakness_tags: [...tags],
    ...(revisionCheck ? { revision_check: revisionCheck } : {}),
    // legacy v1 view of the same review
    praise: data.overall_comment_ja,
    goodPoints: good.slice(0, 2).map((g) => g.explanation_ja),
    oneImprovement: priority[0]?.explanation_ja ?? "",
    example: priority[0]?.suggested_snippet ?? "",
  }
  return { ok: true, feedback, dropped }
}
