export type TaskType = "EMAIL" | "OPINION"

/**
 * "content": meaning / logic problems — fixed by free rewriting, never by a
 * fill-in-the-blank drill. "surface": local form problems (grammar, order,
 * spelling…) that a single-blank drill can practise.
 */
export type ErrorKind = "content" | "surface"

type Def = {
  tasks: readonly TaskType[]
  kind: ErrorKind
  /** Lower = more important. Meaning problems always outrank form problems. */
  rank: number
  /** Only meaningful for lessons that copy the official exam format. */
  examOnly?: boolean
  /** What the model is told this code means. */
  meaning: string
}

export const ERROR_CODES = {
  ERR_OFF_TOPIC: { tasks: ["EMAIL", "OPINION"], kind: "content", rank: 0, meaning: "The text does not answer the task / question at all." },
  ERR_EMAIL_NO_ANSWER: { tasks: ["EMAIL"], kind: "content", rank: 1, meaning: "The email does not answer a question the received email asked." },
  ERR_EMAIL_REPETITIVE_QUESTION: { tasks: ["EMAIL"], kind: "content", rank: 2, meaning: "A question asks for information the received email already states." },
  ERR_EMAIL_DUPLICATE_QUESTIONS: { tasks: ["EMAIL"], kind: "content", rank: 3, meaning: "Two questions ask for substantially the same information." },
  ERR_EMAIL_QUESTION_MISSING: { tasks: ["EMAIL"], kind: "content", rank: 3, examOnly: true, meaning: "Fewer than 2 questions about the underlined part (exam format only)." },
  ERR_EMAIL_REASON_LINK: { tasks: ["EMAIL"], kind: "content", rank: 4, meaning: "An answer and its reason are not logically connected." },
  ERR_OPINION_CONTRADICTION: { tasks: ["OPINION"], kind: "content", rank: 1, meaning: "A reason contradicts the stated opinion." },
  ERR_OPINION_ONE_REASON: { tasks: ["OPINION"], kind: "content", rank: 2, meaning: "Only one reason is given although two are required." },
  ERR_OPINION_WEAK_SUPPORT: { tasks: ["OPINION"], kind: "content", rank: 3, meaning: "A reason is too abstract / does not really support the opinion and needs an example or explanation." },
  ERR_UNCLEAR_REFERENCE: { tasks: ["EMAIL", "OPINION"], kind: "content", rank: 4, meaning: "A pronoun or demonstrative (it / them / this / such…) has no clear referent, so the meaning is ambiguous." },
  ERR_UNCLEAR_MEANING: { tasks: ["EMAIL", "OPINION"], kind: "content", rank: 4, meaning: "A sentence is hard to understand for a reader." },
  ERR_EMAIL_QUESTION_FORM: { tasks: ["EMAIL"], kind: "surface", rank: 10, meaning: "A question has wrong word order, tense, auxiliary or article." },
  ERR_GRAMMAR: { tasks: ["EMAIL", "OPINION"], kind: "surface", rank: 11, meaning: "A grammar error (agreement, verb form, plural, preposition…)." },
  ERR_WORD_ORDER: { tasks: ["EMAIL", "OPINION"], kind: "surface", rank: 11, meaning: "Words are in the wrong order." },
  ERR_TENSE: { tasks: ["EMAIL", "OPINION"], kind: "surface", rank: 11, meaning: "The verb tense does not fit the situation." },
  ERR_ARTICLE: { tasks: ["EMAIL", "OPINION"], kind: "surface", rank: 12, meaning: "A missing / wrong a-an-the that changes naturalness (judge from context)." },
  ERR_VOCABULARY: { tasks: ["EMAIL", "OPINION"], kind: "surface", rank: 12, meaning: "A wrong or unnatural word choice." },
  ERR_SPELLING: { tasks: ["EMAIL", "OPINION"], kind: "surface", rank: 13, meaning: "A spelling mistake." },
} as const satisfies Record<string, Def>

export type ErrorCode = keyof typeof ERROR_CODES

export function isErrorCode(value: string): value is ErrorCode {
  return Object.hasOwn(ERROR_CODES, value)
}

export function codeAllowed(code: ErrorCode, task: TaskType, exam: boolean): boolean {
  const def: Def = ERROR_CODES[code]
  if (!def.tasks.includes(task)) return false
  if (def.examOnly && !exam) return false
  return true
}

export function codeKind(code: ErrorCode): ErrorKind {
  return ERROR_CODES[code].kind
}

export function codeRank(code: ErrorCode): number {
  return ERROR_CODES[code].rank
}

/** Deterministic weakness tag, e.g. ERR_EMAIL_REPETITIVE_QUESTION -> EMAIL_REPETITIVE_QUESTION. */
export function weaknessTag(code: ErrorCode): string {
  return code.replace(/^ERR_/, "")
}

export function describeCodes(task: TaskType, exam: boolean): string {
  return (Object.keys(ERROR_CODES) as ErrorCode[])
    .filter((c) => codeAllowed(c, task, exam))
    .map((c) => `- ${c} (${ERROR_CODES[c].kind}): ${ERROR_CODES[c].meaning}`)
    .join("\n")
}
