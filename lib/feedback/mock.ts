import { FeedbackResult } from "@/types/feedback"
import { Lesson } from "@/types/lesson"
import { countWords, wordStatus } from "@/lib/essay"
import { criteriaFor, taskTypeOf } from "@/lib/feedback/prompt"
import { SCORE_DISCLAIMER_JA } from "@/lib/feedback/validate"

/**
 * Canned feedback for local UI development ONLY. It says nothing about what
 * the student actually wrote, so it must never be shown as real feedback in
 * production (see handler: allowMock) and never completes a Day.
 */
export function getMockFeedback(lesson: Lesson, essay: string): FeedbackResult {
  const task = taskTypeOf(lesson)
  const criteria = criteriaFor(task)
  const n = countWords(essay)
  const breakdown = Object.fromEntries(criteria.map((c) => [c, 3]))
  const reasons = Object.fromEntries(criteria.map((c) => [c, "（デモ）見本の理由です。"]))
  return {
    version: 2,
    task_type: task,
    rubric: "practice",
    overall_comment_ja: "【デモ表示】これは見本のフィードバックです。実際の添削ではありません。",
    score_summary: {
      total_score: criteria.length * 3,
      max_score: criteria.length * 4,
      breakdown,
      reasons_ja: reasons,
      disclaimer_ja: SCORE_DISCLAIMER_JA,
    },
    word_count_analysis: {
      actual_count: n,
      min: lesson.wordCount.min,
      max: lesson.wordCount.max,
      status: wordStatus(n, lesson.wordCount.min, lesson.wordCount.max),
    },
    good_points: [],
    priority_feedback_items: [],
    weakness_tags: [],
    praise: "【デモ表示】これは見本のフィードバックです。実際の添削ではありません。",
    goodPoints: [],
    oneImprovement: "",
    example: "",
    isMock: true,
  }
}
