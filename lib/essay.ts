/** Shared by the editor (button enablement) and the API route (server-side validation). */
export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length
}

/**
 * Hard cap on submitted characters, independent of the per-lesson word
 * limits. Generous for the largest lesson (80 words) but keeps a single
 * request from carrying an arbitrarily large prompt.
 */
export const MAX_ESSAY_CHARS = 1200

/** Hard cap on the whole JSON request body, in bytes. */
export const MAX_REQUEST_BYTES = 8 * 1024

/**
 * Share of non-space characters that must be ASCII letters, digits or
 * common punctuation for a submission to be treated as English writing.
 * Keeps Japanese-only / pasted-garbage input from reaching the model.
 */
const MIN_LATIN_RATIO = 0.8

export function looksLikeEnglish(text: string): boolean {
  const chars = text.replace(/\s/g, "")
  if (chars.length === 0) return false
  const latin = chars.replace(/[^\x21-\x7e‘’“”]/g, "").length
  const letters = (chars.match(/[A-Za-z]/g) ?? []).length
  return latin / chars.length >= MIN_LATIN_RATIO && letters >= chars.length * 0.5
}

/** Drops control characters (keeps \n and \t) so they can't smuggle formatting into the prompt. */
export function stripControlChars(text: string): string {
  return text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
}

/** Normalises quotes/case/whitespace so a model-provided quote can be matched against the essay. */
export function normalizeForMatch(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}
