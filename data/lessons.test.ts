import { describe, expect, it } from "vitest"
import { lessons, getLessonById } from "@/data/lessons"

function findDay(day: number) {
  const lesson = lessons.find((l) => l.day === day)
  if (!lesson) throw new Error(`Day ${day} lesson not found`)
  return lesson
}

describe("lessons: Day1-7 (existing behavior, unchanged)", () => {
  it("still has exactly 7 legacy days with no Meaning First scaffold", () => {
    for (let day = 1; day <= 7; day++) {
      const lesson = findDay(day)
      expect(lesson.scene).toBeUndefined()
      expect(lesson.comprehension).toBeUndefined()
      expect(lesson.keyExpressions).toBeUndefined()
      expect(lesson.guidedPractice).toBeUndefined()
    }
  })

  it("alternates opinion/email as before", () => {
    const types = [1, 2, 3, 4, 5, 6, 7].map((day) => findDay(day).type)
    expect(types).toEqual([
      "opinion",
      "email",
      "opinion",
      "email",
      "opinion",
      "email",
      "opinion",
    ])
  })
})

describe("lessons: Day8-14 (Meaning First expansion)", () => {
  it("adds exactly Day8 through Day14, sequentially", () => {
    const days = lessons.map((l) => l.day).sort((a, b) => a - b)
    expect(days).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
  })

  it("every Day8-14 lesson has the full Meaning First scaffold populated", () => {
    for (let day = 8; day <= 14; day++) {
      const lesson = findDay(day)
      expect(lesson.scene, `Day${day} scene`).toBeDefined()
      expect(lesson.scene!.contextJa.length).toBeGreaterThan(0)
      expect(lesson.scene!.intro.length).toBeGreaterThan(0)
      expect(lesson.comprehension?.length ?? 0, `Day${day} comprehension`).toBeGreaterThan(0)
      expect(lesson.keyExpressions?.length ?? 0, `Day${day} keyExpressions`).toBeGreaterThan(0)
      expect(lesson.guidedPractice?.length ?? 0, `Day${day} guidedPractice`).toBeGreaterThan(0)
    }
  })

  it("getLessonById resolves the new days (day-8 .. day-14)", () => {
    for (let day = 8; day <= 14; day++) {
      const lesson = getLessonById(`day-${day}`)
      expect(lesson?.day).toBe(day)
    }
  })
})

describe("Day8: should / But some people say, without have to (per review feedback)", () => {
  it("centers should + the concession phrase, and does not introduce have to / don't have to", () => {
    const day8 = findDay(8)
    const phrases = day8.keyExpressions!.map((k) => k.phrase)
    expect(phrases.some((p) => p.includes("should"))).toBe(true)
    expect(phrases.some((p) => p.includes("But some people say"))).toBe(true)
    expect(phrases.some((p) => p.includes("have to"))).toBe(false)
  })
})

describe("Day12: no overclaiming that books have no wrong information", () => {
  it("uses a natural, accurate claim about books instead", () => {
    const day12 = findDay(12)
    const text = `${day12.answerExample} ${JSON.stringify(day12.guidedPractice)}`
    expect(text).not.toMatch(/don't have wrong information/i)
    expect(day12.answerExample).toMatch(/carefully checked/i)
  })
})

describe("Day14: natural concession about smartphones, not 'look strange'", () => {
  it("guided practice reflects distraction + clear rules, not the discarded phrasing", () => {
    const day14 = findDay(14)
    const guidedPracticeText = JSON.stringify(day14.guidedPractice)
    expect(guidedPracticeText).not.toMatch(/look strange/i)
    expect(guidedPracticeText).toMatch(/distract/i)
    expect(guidedPracticeText).toMatch(/clear rules/i)
  })
})
