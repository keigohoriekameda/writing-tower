import { FeedbackResult } from "@/types/feedback"
import { Lesson } from "@/types/lesson"

export const MOCK_FEEDBACK: FeedbackResult = {
  praise: "Great effort! You wrote a clear opinion with a good structure.",
  goodPoints: [
    "Your opening sentence states your position clearly.",
    "You used connecting words like 'also' and 'because' effectively.",
  ],
  oneImprovement: "Try to add a specific example or real situation to make your second reason stronger.",
  example:
    "For instance: 'For example, when students forget a textbook, they can quickly access the material online without missing the lesson.'",
  isMock: true,
}

export function buildPrompt(lesson: Lesson, essay: string): string {
  return `You are a friendly and encouraging English writing coach for Japanese junior high school students preparing for the Eiken Grade Pre-2 exam.

A student has written the following essay in response to this question:

Question: ${lesson.prompt}

Student's Essay:
${essay}

Your job is to give warm, coach-style feedback — not grades or scores. Focus on building confidence while giving one clear, actionable improvement.

Respond with ONLY a valid JSON object in this exact format:
{
  "praise": "A short, genuine 1-sentence compliment about the essay overall.",
  "goodPoints": [
    "First specific strength (1 sentence)",
    "Second specific strength (1 sentence)"
  ],
  "oneImprovement": "Exactly one improvement suggestion, stated gently and constructively (1–2 sentences).",
  "example": "A concrete rewritten example sentence or phrase that shows the improvement in action."
}

Rules:
- Always respond in English
- praise must be warm and specific, not generic
- goodPoints must have exactly 2 items
- oneImprovement must be exactly 1 suggestion only — never list more
- example must be a realistic sentence a junior high student could write
- Do not include scores, grades, or negative language`
}
