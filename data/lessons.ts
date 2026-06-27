import { Lesson } from "@/types/lesson"

export const lessons: Lesson[] = [
  {
    id: "day-1",
    day: 1,
    type: "opinion",
    title: "Smartphones at School",
    topic: "Should students use smartphones at school?",
    prompt:
      "Some people think students should be allowed to use smartphones at school. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
