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
    answerExample:
      "I agree that students should be allowed to use smartphones at school. First, smartphones can help students find information quickly during class. Second, smartphones make it easy to contact parents in an emergency. So, smartphones are useful tools for students, and schools should allow them with clear rules.",
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
    answerExample:
      "Hi Alex,\n\nThank you for your email. I have a long weekend soon, and I'm planning to visit my grandparents in the countryside. We will cook dinner together and watch movies at night. I'm also going to finish my homework on Sunday morning.\n\nWhat about you? Do you have any plans for your weekend?\n\nBest,\n[Your name]",
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
    answerExample:
      "I agree that students should wear school uniforms. First, uniforms save time in the morning because students don't need to choose their clothes. Second, uniforms make all students feel equal, no matter how rich or poor their families are. So, I believe uniforms are a good rule for schools to keep.",
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
    answerExample:
      "Hi Alex,\n\nThanks for asking about my club. I'm in the tennis club at my school. We practice every Tuesday and Friday after class. I like my club because I can make new friends and get good exercise. Our team is preparing for a tournament next month, so we are practicing very hard.\n\nBest,\n[Your name]",
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
    answerExample:
      "I agree that high school students should study abroad. First, studying abroad helps students improve their English skills quickly because they use it every day. Second, it gives students a chance to learn about different cultures and make friends from other countries. So, studying abroad is a great experience for high school students.",
  },
  {
    id: "day-6",
    day: 6,
    type: "email",
    title: "Favorite Subject",
    topic: "Reply to Alex's email about your favorite subject.",
    prompt:
      "You received an email from your foreign friend, Alex.\n\nHi,\nI'm curious about school in Japan.\nWhat is your favorite subject?\nWhy do you like it?\n\nAlex\n\nWrite an email to Alex.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "Hi Alex,\n\nThanks for your email. My favorite subject is English. I like it because I can talk with people from different countries. My teacher also makes the lessons fun with games and songs. I want to keep studying English so I can travel abroad someday.\n\nBest,\n[Your name]",
  },
  {
    id: "day-7",
    day: 7,
    type: "opinion",
    title: "Part-time Jobs",
    topic: "Should high school students have part-time jobs?",
    prompt:
      "Some people think high school students should have part-time jobs. Do you agree with this idea? Write your opinion with two reasons to support your answer.",
    wordCount: { min: 50, max: 80 },
    timeLimit: 10,
    answerExample:
      "I agree that high school students should have part-time jobs. First, working part-time helps students learn how to manage their own money. Second, it teaches important skills like communication and responsibility that are useful in the future. So, I think part-time jobs are a valuable experience for high school students.",
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
