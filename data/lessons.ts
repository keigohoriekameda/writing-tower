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
  {
    id: "day-2",
    day: 2,
    type: "email",
    title: "Weekend Plans",
    topic: "Reply to Alex's email about your weekend plans.",
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI heard you have a long weekend soon.\nWhat are you going to do during the weekend?\nCan you tell me about your plans?\n\nAlex\n\nWrite an email to Alex.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
  },
  {
    id: "day-3",
    day: 3,
    type: "opinion",
    title: "School Uniforms",
    topic: "Should students wear school uniforms?",
    prompt:
      "Some people think students should wear school uniforms. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
  },
  {
    id: "day-4",
    day: 4,
    type: "email",
    title: "Club Activities",
    topic: "Reply to Alex's email about your club activities.",
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI heard many students in Japan join club activities.\nWhat club are you in?\nWhat do you like about it?\n\nAlex\n\nWrite an email to Alex.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
  },
  {
    id: "day-5",
    day: 5,
    type: "opinion",
    title: "Studying Abroad",
    topic: "Should high school students study abroad?",
    prompt:
      "Some people think high school students should study abroad. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
