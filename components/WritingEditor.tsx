"use client"

import { useState } from "react"
import { Lesson } from "@/types/lesson"
import { FeedbackResult } from "@/types/feedback"
import FeedbackView from "@/components/FeedbackView"
import WritingScaffold from "@/components/WritingScaffold"
import EmailScaffold from "@/components/EmailScaffold"

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "feedback"; data: FeedbackResult }
  | { status: "error"; message: string }

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length
}

type Props = {
  lesson: Lesson
}

export default function WritingEditor({ lesson }: Props) {
  const [text, setText] = useState("")
  const [state, setState] = useState<State>({ status: "idle" })

  const wordCount = countWords(text)
  const isReady = wordCount >= lesson.wordCount.min && wordCount <= lesson.wordCount.max

  async function handleSubmit() {
    setState({ status: "loading" })
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, essay: text }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = (await res.json()) as FeedbackResult
      setState({ status: "feedback", data })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setState({ status: "error", message })
    }
  }

  if (state.status === "loading") {
    return <LoadingView />
  }

  if (state.status === "feedback") {
    return (
      <FeedbackView
        feedback={state.data}
        essay={text}
        day={lesson.day}
        answerExample={lesson.answerExample}
      />
    )
  }

  if (state.status === "error") {
    return (
      <ErrorView
        message={state.message}
        onRetry={() => setState({ status: "idle" })}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {lesson.type === "email" ? <EmailScaffold /> : <WritingScaffold />}

      <div className="rounded-2xl bg-indigo-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Question</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-indigo-800">{lesson.prompt}</p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lesson.type === "email" ? "Write your email here..." : "Write your essay here..."}
        rows={10}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-900 placeholder-gray-300 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />

      <div className="flex items-center justify-between">
        <WordCountBadge count={wordCount} min={lesson.wordCount.min} max={lesson.wordCount.max} />
        <button
          onClick={handleSubmit}
          disabled={!isReady}
          className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {lesson.type === "email" ? "Send Email" : "Submit Essay"}
        </button>
      </div>
    </div>
  )
}

function WordCountBadge({ count, min, max }: { count: number; min: number; max: number }) {
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

function LoadingView() {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-gray-400">Your coach is reviewing your essay...</p>
    </div>
  )
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-400">
        !
      </div>
      <div>
        <p className="text-base font-semibold text-gray-800">Could not get feedback</p>
        <p className="mt-1 text-sm text-gray-400">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
      >
        Try Again
      </button>
    </div>
  )
}
