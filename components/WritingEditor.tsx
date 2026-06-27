"use client"

import { useState } from "react"
import Link from "next/link"
import { Lesson } from "@/types/lesson"

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length
}

type Props = {
  lesson: Lesson
}

export default function WritingEditor({ lesson }: Props) {
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const wordCount = countWords(text)
  const isReady = wordCount >= lesson.wordCount.min && wordCount <= lesson.wordCount.max

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Essay Submitted!</h2>
        <p className="text-gray-500">Great work on Day {lesson.day}.</p>
        <Link
          href="/"
          className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl bg-indigo-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Question</p>
        <p className="mt-2 text-sm leading-relaxed text-indigo-800">{lesson.prompt}</p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your essay here..."
        rows={10}
        className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-900 placeholder-gray-300 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />

      <div className="flex items-center justify-between">
        <WordCountBadge
          count={wordCount}
          min={lesson.wordCount.min}
          max={lesson.wordCount.max}
        />
        <button
          onClick={() => setSubmitted(true)}
          disabled={!isReady}
          className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          Submit Essay
        </button>
      </div>
    </div>
  )
}

function WordCountBadge({
  count,
  min,
  max,
}: {
  count: number
  min: number
  max: number
}) {
  const colorClass =
    count === 0
      ? "text-gray-400"
      : count < min
        ? "text-orange-500"
        : count > max
          ? "text-red-500"
          : "text-green-600"

  return (
    <span className={`text-sm font-medium ${colorClass}`}>
      {count} / {min}–{max} words
    </span>
  )
}
