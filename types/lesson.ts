export type LessonType = "opinion" | "email"

export type Lesson = {
  id: string
  day: number
  type: LessonType
  title: string
  topic: string
  prompt: string
  wordCount: { min: number; max: number }
  timeLimit: number
  answerExample?: string
}
