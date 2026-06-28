import { FeedbackResult } from "@/types/feedback"
import { Lesson } from "@/types/lesson"

const MOCK_OPINION_FEEDBACK: FeedbackResult = {
  praise: "よく書けています！意見が明確で、文章の構成もしっかりしていますよ。",
  goodPoints: [
    "最初の文で自分の意見をはっきり伝えられています。",
    "「also」や「because」などの接続語を上手に使えています。",
  ],
  oneImprovement: "2つ目の理由に具体的な例を加えると、さらに説得力が増しますよ。",
  example:
    "For example: 'When students forget a textbook, they can quickly access the material online without missing the lesson.'",
  isMock: true,
}

const MOCK_EMAIL_FEEDBACK: FeedbackResult = {
  praise: "Eメールの形式をしっかり使えています！自然でわかりやすいメールですよ。",
  goodPoints: [
    "「Hi Alex,」から始まり、最後に名前を書くメールの形式が正しくできています。",
    "質問に対して自分の言葉でしっかり答えられています。",
  ],
  oneImprovement:
    "しめの文にもう一言添えると、より自然なメールになります。感想や次の話題を一言つなげてみましょう。",
  example: "For example: 'I'm really looking forward to telling you more about it!'",
  isMock: true,
}

export function getMockFeedback(lesson: Lesson): FeedbackResult {
  return lesson.type === "email" ? MOCK_EMAIL_FEEDBACK : MOCK_OPINION_FEEDBACK
}

function buildOpinionPrompt(lesson: Lesson, essay: string): string {
  return `You are a friendly and encouraging English writing coach for Japanese junior high school students preparing for the Eiken Grade Pre-2 exam.

A student has written the following opinion essay in response to this question:

Question: ${lesson.prompt}

Student's Essay:
${essay}

Your job is to give warm, coach-style feedback — not grades or scores. Focus on building confidence while giving one clear, actionable improvement.

Evaluate based on these criteria for opinion writing:
- Does the student clearly state their opinion?
- Are two reasons provided to support the opinion?
- Is the structure logical (opinion → reason 1 → reason 2)?
- Grammar and vocabulary usage
- Word count appropriateness

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

function buildEmailPrompt(lesson: Lesson, essay: string): string {
  return `You are a friendly and encouraging English writing coach for Japanese junior high school students preparing for the Eiken Grade Pre-2 exam.

A student has written the following email in response to this task:

Task: ${lesson.prompt}

Student's Email:
${essay}

Your job is to give warm, coach-style feedback — not grades or scores. Focus on building confidence while giving one clear, actionable improvement.

Evaluate based on these criteria for email writing:
- Is it written in email format (greeting like "Hi Alex," and sign-off with the student's name)?
- Does the student answer the question(s) asked in the received email?
- Is the content natural and easy to understand?
- Is the structure appropriate for a friendly email?
- Grammar and vocabulary usage
- Word count appropriateness

IMPORTANT: This is an EMAIL task, not an opinion essay. Do NOT comment on "two reasons" or opinion essay structure. Focus on email communication skills only.

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
- example must be a realistic email sentence a junior high student could write
- Do not include scores, grades, or negative language`
}

export function buildPrompt(lesson: Lesson, essay: string): string {
  return lesson.type === "email"
    ? buildEmailPrompt(lesson, essay)
    : buildOpinionPrompt(lesson, essay)
}
