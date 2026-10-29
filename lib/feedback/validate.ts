import { z } from "zod"
import { FeedbackResult } from "@/types/feedback"
import { looksLikeEnglish, normalizeForMatch } from "@/lib/essay"

const JAPANESE = /[぀-ヿ㐀-鿿]/

const ja = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine((s) => JAPANESE.test(s), "must be Japanese")

const ModelOutputSchema = z.object({
  evidence: z.string().trim().min(3).max(200),
  praise: ja(200),
  goodPoints: z.array(ja(200)).length(2),
  oneImprovement: ja(300),
  example: z
    .string()
    .trim()
    .min(3)
    .max(300)
    .refine((s) => looksLikeEnglish(s), "must be English"),
})

export type ParseResult = { ok: true; feedback: FeedbackResult } | { ok: false; reason: string }

/**
 * Parses and checks the model's JSON. Besides shape, it requires that the
 * quoted `evidence` really occurs in the student's text — the cheapest
 * reliable signal that the feedback is about THIS answer and not generic
 * (or about injected instructions).
 */
export function parseModelFeedback(raw: string, essay: string): ParseResult {
  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return { ok: false, reason: "not_json" }
  }

  const parsed = ModelOutputSchema.safeParse(json)
  if (!parsed.success) {
    return { ok: false, reason: `schema:${parsed.error.issues[0]?.path.join(".") ?? "?"}` }
  }
  const out = parsed.data

  if (!normalizeForMatch(essay).includes(normalizeForMatch(out.evidence))) {
    return { ok: false, reason: "evidence_not_in_essay" }
  }

  const all = [out.praise, ...out.goodPoints, out.oneImprovement, out.example].join("\n")
  if (/student_text/i.test(all)) return { ok: false, reason: "prompt_leak" }

  return {
    ok: true,
    feedback: {
      praise: out.praise,
      goodPoints: out.goodPoints,
      oneImprovement: out.oneImprovement,
      example: out.example,
      evidence: out.evidence,
    },
  }
}
