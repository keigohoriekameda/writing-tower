import { handleFeedbackRequest, FeedbackDeps } from "@/lib/feedback/handler"
import { MemoryQuota } from "@/lib/feedback/quota"
import { resolveStudentAccess } from "@/lib/auth/session"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getOpenAI } from "@/lib/openai"

export const maxDuration = 30

const memoryQuota = new MemoryQuota()

const deps: FeedbackDeps = {
  async authenticate(accessToken) {
    const db = createSupabaseServerClient(accessToken)
    const result = await resolveStudentAccess(db, accessToken)
    if (result.status === "ok") return { ok: true, userId: result.student.userId, db }
    return { ok: false, status: result.status }
  },
  async generate(messages) {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 700,
    })
    return response.choices[0]?.message.content ?? null
  },
  isAiConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  allowMock: () =>
    process.env.NODE_ENV !== "production" && process.env.WRITING_TOWER_ALLOW_MOCK_FEEDBACK === "true",
  memoryQuota,
}

export async function POST(req: Request) {
  return handleFeedbackRequest(req, deps)
}
