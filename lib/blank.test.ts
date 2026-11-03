import { describe, expect, it } from "vitest"
import { applyReplacement, fillBlank, matchesBlank, normalizeAnswer } from "@/lib/blank"
import { validateFillBlank } from "@/lib/feedback/fillBlank"
import { isFeedbackResult } from "@/lib/feedbackClient"

describe("blank answers", () => {
  it("accepts any listed answer, ignoring case, spaces and trailing punctuation", () => {
    expect(matchesBlank("  Goes. ", ["goes"])).toBe(true)
    expect(matchesBlank("useful", ["useful", "helpful"])).toBe(true)
    expect(matchesBlank("helpful", ["useful", "helpful"])).toBe(true)
  })
  it("rejects wrong or empty answers", () => {
    expect(matchesBlank("go", ["goes"])).toBe(false)
    expect(matchesBlank("   ", ["goes"])).toBe(false)
  })
  it("normalises curly apostrophes", () => {
    expect(normalizeAnswer("don’t")).toBe("don't")
  })
  it("applies a fix to the student's own text only when the snippet is still there", () => {
    expect(applyReplacement("He go to school. He runs.", "He go to school", "He goes to school")).toBe("He goes to school. He runs.")
    expect(applyReplacement("He went to school.", "He go to school", "He goes to school")).toBeNull()
    // a snippet quoted on one line still matches text with line breaks, and regex characters are literal
    expect(applyReplacement("Hi Alex,\n\nThank you (a lot).", "Hi Alex, Thank you (a lot).", "X")).toBe("X")
  })
})

describe("validateFillBlank (the spec's own example: 'He go to school every day.')", () => {
  const original = "He go to school every day."
  const suggested = "He goes to school every day."
  it("builds the drill from the student's sentence and confirms the completed sentence", () => {
    const fb = validateFillBlank({ prompt: "He [ ___ ] to school every day.", acceptable_answers: ["goes"] }, original, suggested)
    expect(fb).toEqual({ prompt: "He ___ to school every day.", acceptable_answers: ["goes"], completed_sentence: "He goes to school every day." })
  })
  it.each([
    ["no blank", { prompt: "He goes to school every day.", acceptable_answers: ["goes"] }],
    ["two blanks", { prompt: "He ___ to ___ every day.", acceptable_answers: ["goes"] }],
    ["no answers", { prompt: "He ___ to school every day.", acceptable_answers: [] }],
    ["answer that does not rebuild the correction", { prompt: "He ___ to school every day.", acceptable_answers: ["went"] }],
    ["a different sentence", { prompt: "She ___ to the park on Sundays.", acceptable_answers: ["goes"] }],
    ["not an object", "He ___ to school"],
  ])("rejects %s", (_n, fb) => {
    expect(validateFillBlank(fb, original, suggested)).toBeUndefined()
  })
  it("keeps natural alternatives", () => {
    const fb = validateFillBlank({ prompt: "I ___ it is useful.", acceptable_answers: ["think", "believe"] }, "I thinks it is useful.", "I think it is useful.")
    expect(fb?.acceptable_answers).toEqual(["think", "believe"])
    expect(fillBlank(fb!.prompt, "believe")).toBe("I believe it is useful.")
  })
})

describe("client-side response check", () => {
  const ok = {
    version: 2, overall_comment_ja: "x", score_summary: { total_score: 1, max_score: 12, breakdown: { content: 1 }, reasons_ja: {}, disclaimer_ja: "d" },
    word_count_analysis: { actual_count: 40, min: 40, max: 50, status: "IN_RANGE" }, good_points: [], priority_feedback_items: [], weakness_tags: [],
  }
  it("accepts a well-formed review and rejects anything else", () => {
    expect(isFeedbackResult(ok)).toBe(true)
    expect(isFeedbackResult({ ...ok, version: 1 })).toBe(false)
    expect(isFeedbackResult({ ...ok, score_summary: undefined })).toBe(false)
    expect(isFeedbackResult({ praise: "old shape", goodPoints: [], oneImprovement: "", example: "" })).toBe(false)
    expect(isFeedbackResult(null)).toBe(false)
  })
})
