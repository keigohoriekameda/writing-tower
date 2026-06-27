import { FeedbackResult } from "@/types/feedback"
import { Lesson } from "@/types/lesson"

export const MOCK_FEEDBACK: FeedbackResult = {
  praise: "よく書けています！意見が明確で、文章の構成もしっかりしていますよ。",
  goodPoints: [
    "最初の文で自分の意見をはっきり伝えられています。",
    "「also」や「because」などの接続語を上手に使えています。",
  ],
  oneImprovement:
    "2つ目の理由に具体的な例を加えると、さらに説得力が増しますよ。",
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
  "praise": "短く温かい1文の全体コメント（日本語で）",
  "goodPoints": [
    "1つ目の具体的な良い点（日本語で1文）",
    "2つ目の具体的な良い点（日本語で1文）"
  ],
  "oneImprovement": "改善提案を1つだけ、優しく前向きに（日本語で1〜2文）",
  "example": "A concrete rewritten example sentence in English that shows the improvement in action."
}

Rules:
- praise, goodPoints, oneImprovement must be written in Japanese
- example must be written in English (it is a model sentence for the student to learn from)
- praise must be warm and specific, not generic
- goodPoints must have exactly 2 items
- oneImprovement must be exactly 1 suggestion only — never list more
- example must be a realistic sentence a junior high student could write
- Do not include scores, grades, or negative language`
}
