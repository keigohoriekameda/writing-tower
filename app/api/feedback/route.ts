import { NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/openai"
import { buildPrompt, MOCK_FEEDBACK } from "@/lib/feedback"
import { getLessonById } from "@/data/lessons"
import { FeedbackResult } from "@/types/feedback"

export async function POST(req: NextRequest) {
  try {
    const { lessonId, essay } = await req.json()

    const lesson = getLessonById(lessonId)
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(MOCK_FEEDBACK)
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: buildPrompt(lesson, essay) }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error("Empty response from OpenAI")

    const feedback = JSON.parse(content) as FeedbackResult
    return NextResponse.json(feedback)
  } catch (err) {
    console.error("Feedback API error:", err)
    return NextResponse.json(MOCK_FEEDBACK)
  }
}
