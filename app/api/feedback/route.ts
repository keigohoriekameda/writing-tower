import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getOpenAI } from "@/lib/openai"
import { buildPrompt, getMockFeedback } from "@/lib/feedback"
import { getLessonById } from "@/data/lessons"

const FeedbackSchema = z.object({
  praise: z.string(),
  goodPoints: z.array(z.string()).length(2),
  oneImprovement: z.string(),
  example: z.string(),
})

export async function POST(req: NextRequest) {
  const { lessonId, essay } = await req.json()

  const lesson = getLessonById(lessonId)
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(getMockFeedback(lesson))
  }

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildPrompt(lesson, essay) }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error("Empty response from OpenAI")

    const parsed = FeedbackSchema.safeParse(JSON.parse(content))
    if (!parsed.success) {
      console.error("Feedback validation failed:", parsed.error.issues)
      return NextResponse.json(getMockFeedback(lesson))
    }

    return NextResponse.json(parsed.data)
  } catch (err) {
    console.error("Feedback API error:", err)
    return NextResponse.json(getMockFeedback(lesson))
  }
}
