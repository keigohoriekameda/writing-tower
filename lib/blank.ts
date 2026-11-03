/** Shared by the server (validating AI fill-in drills) and the browser (checking the student's answer). */

export const BLANK = "___"

/** Lower-cases, unifies quotes, drops punctuation (keeps apostrophes) and collapses spaces. */
export function normalizeAnswer(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** True if what the student typed equals any accepted answer (case / spacing / punctuation-insensitive). */
export function matchesBlank(input: string, acceptable: readonly string[]): boolean {
  const n = normalizeAnswer(input)
  return n !== "" && acceptable.some((a) => normalizeAnswer(a) === n)
}

export function fillBlank(prompt: string, answer: string): string {
  return prompt.replace(BLANK, answer.trim())
}

/**
 * Replaces the first occurrence of `snippet` in `text` with `replacement`
 * (whitespace-tolerant: a snippet quoted on one line still matches text that
 * has line breaks there). Returns null if the snippet is no longer present
 * (the student edited it), so the caller can ask the student to edit by hand
 * instead of guessing.
 */
export function applyReplacement(text: string, snippet: string, replacement: string): string | null {
  const parts = snippet.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return null
  const pattern = parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+")
  const m = new RegExp(pattern).exec(text)
  if (!m) return null
  return text.slice(0, m.index) + replacement + text.slice(m.index + m[0].length)
}
