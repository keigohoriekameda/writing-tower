import { BLANK, fillBlank, normalizeAnswer } from "@/lib/blank"
import { FillBlankPractice } from "@/types/feedback"

const MIN_PROMPT_OVERLAP = 0.6

function tokens(text: string): string[] {
  return normalizeAnswer(text).split(" ").filter(Boolean)
}

/**
 * Checks an AI-proposed fill-in drill and returns it only if it is safe:
 * exactly one blank, built from the student's own sentence, and filling it
 * with an answer reproduces the suggested correction. Anything else returns
 * undefined (the item then falls back to a free rewrite).
 */
export function validateFillBlank(
  raw: unknown,
  originalSnippet: string,
  suggestedSnippet: string
): FillBlankPractice | undefined {
  if (typeof raw !== "object" || raw === null) return undefined
  const { prompt, acceptable_answers } = raw as { prompt?: unknown; acceptable_answers?: unknown }
  if (typeof prompt !== "string" || !Array.isArray(acceptable_answers)) return undefined

  // Accept "[ ___ ]" / "____" style markers and normalise to a single "___".
  const unified = prompt.replace(/\[\s*_{3,}\s*\]/g, BLANK).replace(/_{3,}/g, BLANK).trim()
  if (unified.split(BLANK).length !== 2) return undefined // not exactly one blank
  if (unified.length > 300) return undefined

  const answers = [
    ...new Set(
      acceptable_answers
        .filter((a): a is string => typeof a === "string")
        .map((a) => a.trim())
        .filter((a) => a.length > 0 && a.length <= 40 && tokens(a).length <= 3)
    ),
  ].slice(0, 4)
  if (answers.length === 0) return undefined

  // The drill must be the student's own sentence with part removed, not a new sentence.
  const original = new Set(tokens(originalSnippet))
  const promptTokens = tokens(unified.replace(BLANK, " "))
  if (promptTokens.length === 0) return undefined
  const overlap = promptTokens.filter((t) => original.has(t)).length / promptTokens.length
  if (overlap < MIN_PROMPT_OVERLAP) return undefined

  // At least one answer must reproduce the suggested correction exactly.
  const target = normalizeAnswer(suggestedSnippet)
  const matching = answers.find((a) => normalizeAnswer(fillBlank(unified, a)) === target)
  if (!matching) return undefined

  // The blank must not already contain the answer (nothing left to do) …
  if (normalizeAnswer(unified.replace(BLANK, " ")) === target) return undefined

  return { prompt: unified, acceptable_answers: answers, completed_sentence: fillBlank(unified, matching) }
}
