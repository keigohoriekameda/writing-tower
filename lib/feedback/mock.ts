import { FeedbackResult } from "@/types/feedback"
import { Lesson } from "@/types/lesson"

/**
 * Canned feedback for local UI development ONLY. It says nothing about
 * what the student actually wrote, so it must never be shown as real
 * feedback in production (see handler: allowMock) and never completes a Day.
 */
const MOCK_OPINION_FEEDBACK: FeedbackResult = {
  praise: "【デモ表示】これは見本のフィードバックです。実際の添削ではありません。",
  goodPoints: [
    "（デモ）最初の文で自分の意見をはっきり伝えられています。",
    "（デモ）「also」や「because」などの接続語を上手に使えています。",
  ],
  oneImprovement: "（デモ）2つ目の理由に具体的な例を加えると、さらに説得力が増しますよ。",
  example:
    "For example: 'When students forget a textbook, they can quickly access the material online without missing the lesson.'",
  isMock: true,
}

const MOCK_EMAIL_FEEDBACK: FeedbackResult = {
  praise: "【デモ表示】これは見本のフィードバックです。実際の添削ではありません。",
  goodPoints: [
    "（デモ）「Hi Alex,」から始まり、最後に名前を書くメールの形式が正しくできています。",
    "（デモ）質問に対して自分の言葉でしっかり答えられています。",
  ],
  oneImprovement:
    "（デモ）しめの文にもう一言添えると、より自然なメールになります。感想や次の話題を一言つなげてみましょう。",
  example: "For example: 'I'm really looking forward to telling you more about it!'",
  isMock: true,
}

export function getMockFeedback(lesson: Lesson): FeedbackResult {
  return lesson.type === "email" ? MOCK_EMAIL_FEEDBACK : MOCK_OPINION_FEEDBACK
}
