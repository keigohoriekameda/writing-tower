// Shared fixtures for the feedback tests (not shipped: only imported from *.test.ts).
import { vi, type Mock } from "vitest"
import { handleFeedbackRequest, FeedbackDeps } from "@/lib/feedback/handler"
import { MemoryQuota } from "@/lib/feedback/quota"
import { getLessonById } from "@/data/lessons"
import type { Lesson } from "@/types/lesson"

export const TOKEN = "aaa.bbb.ccc"
export const day1 = getLessonById("day-1")! // opinion, 50-80 words
export const day2 = getLessonById("day-2")! // practice email, 50-80 words

/** An official-format email task (two questions about an underlined part, 40-50 words). */
export const examEmail: Lesson = {
  id: "exam-email",
  day: 99,
  type: "email",
  examFormat: true,
  underlinedPhrase: "the sports day",
  title: "Exam-format email",
  topic: "Reply to Alex",
  prompt:
    "You received an email from your foreign friend, Alex.\n\nHi!\nI went to the sports day on Sunday. My class won the relay race, and I was very happy. After that, we had lunch together in the park. Do you often join school events?\n\nYour friend,\nAlex\n\nWrite an email to Alex. Answer his question and ask 2 questions about the sports day.",
  wordCount: { min: 40, max: 50 },
  timeLimit: 10,
}

export type ModelOut = Record<string, unknown>

/** What a well-behaved model returns for a clean answer; tests override pieces of it. */
export function modelOut(task: "EMAIL" | "OPINION", over: ModelOut = {}): ModelOut {
  const scores = task === "EMAIL" ? { content: 3, vocabulary: 3, grammar: 3 } : { content: 3, structure: 3, vocabulary: 3, grammar: 3 }
  const reasons = Object.fromEntries(Object.keys(scores).map((k) => [k, "意味がよく伝わっています。"]))
  return {
    overall_comment_ja: "意見がはっきり書けていて、読みやすい英文です。",
    scores,
    score_reasons_ja: reasons,
    good_points: [],
    priority_feedback_items: [],
    ...over,
  }
}

export const quote = (essay: string, from: number, to: number) => essay.split(/\s+/).slice(from, to).join(" ")

export function makeDeps(output: ModelOut | string | (() => Promise<string | null>), extra: Partial<FeedbackDeps> = {}) {
  const generate =
    typeof output === "function"
      ? vi.fn(output)
      : vi.fn().mockResolvedValue(typeof output === "string" ? output : JSON.stringify(output))
  const db = { rpc: vi.fn().mockResolvedValue({ data: [{ allowed: true, reason: null, retry_after_seconds: 0 }], error: null }) }
  const deps = {
    authenticate: vi.fn().mockResolvedValue({ ok: true, userId: "user-1", db }),
    generate,
    isAiConfigured: () => true,
    allowMock: () => false,
    memoryQuota: new MemoryQuota(),
    getLesson: (id: string) => (id === examEmail.id ? examEmail : getLessonById(id)),
    ...extra,
  }
  return deps as FeedbackDeps & { generate: Mock; authenticate: Mock; getLesson: NonNullable<FeedbackDeps["getLesson"]> }
}

export function post(body: unknown) {
  return new Request("http://localhost/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(body),
  })
}

/** Runs one review through the real handler with a mocked model. */
export async function review(
  lessonId: string,
  essay: string,
  output: ModelOut | string | (() => Promise<string | null>),
  revision?: unknown
) {
  const deps = makeDeps(output)
  const res = await handleFeedbackRequest(post({ lessonId, essay, ...(revision ? { revision } : {}) }), deps)
  const body = await res.json()
  const messages = deps.generate.mock.calls[0]?.[0] as { role: string; content: string }[] | undefined
  return {
    res,
    body,
    deps,
    system: messages?.find((m) => m.role === "system")?.content ?? "",
    user: messages?.find((m) => m.role === "user")?.content ?? "",
  }
}
