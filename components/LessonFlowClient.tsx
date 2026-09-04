"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ComprehensionQuestion,
  GuidedPracticeItem,
  KeyExpression,
  Lesson,
  LessonScene,
} from "@/types/lesson"

const STEP_LABELS = ["場面", "内容理解", "重要表現", "練習", "Writing"] as const

type Props = {
  lesson: Lesson
}

export default function LessonFlowClient({ lesson }: Props) {
  const [stepIndex, setStepIndex] = useState(0)

  // Day1〜7 (scene未設定) は Meaning First の足場を挟まず、
  // 従来どおりQuestion + Start Writingのみを表示する。
  if (!lesson.scene) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">Day {lesson.day}</span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-600">
            {lesson.type}
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{lesson.title}</h1>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Question</p>
          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-800">{lesson.prompt}</p>
        </div>

        <div className="flex gap-3 text-sm text-gray-400">
          <span>{lesson.wordCount.min}–{lesson.wordCount.max} words</span>
          <span>·</span>
          <span>{lesson.timeLimit} min</span>
        </div>

        <Link
          href={`/lessons/${lesson.id}/writing`}
          className="mt-2 flex h-14 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Start Writing →
        </Link>
      </div>
    )
  }

  const lastStepIndex = STEP_LABELS.length - 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">Day {lesson.day}</span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-600">
            {lesson.type}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{lesson.title}</h1>
      </div>

      <StepIndicator current={stepIndex} />

      {stepIndex === 0 && <SceneStep scene={lesson.scene} />}
      {stepIndex === 1 && <ComprehensionStep questions={lesson.comprehension ?? []} />}
      {stepIndex === 2 && <KeyExpressionsStep items={lesson.keyExpressions ?? []} />}
      {stepIndex === 3 && <GuidedPracticeStep items={lesson.guidedPractice ?? []} />}
      {stepIndex === 4 && <WritingStep lesson={lesson} />}

      {stepIndex < lastStepIndex && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-0"
          >
            ← 戻る
          </button>
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.min(lastStepIndex, i + 1))}
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            次へ →
          </button>
        </div>
      )}
    </div>
  )
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEP_LABELS.map((label, i) => (
        <div
          key={label}
          className={`flex-1 rounded-full py-1 text-center text-[10px] font-semibold ${
            i <= current ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

function SceneStep({ scene }: { scene: LessonScene }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">場面を確認しよう</p>
      <div className="rounded-2xl bg-gray-50 p-5">
        <p className="text-sm leading-relaxed text-gray-700">{scene.contextJa}</p>
      </div>
      <div className="rounded-2xl border border-indigo-100 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">英文を読んでみよう</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-800">{scene.intro}</p>
      </div>
    </div>
  )
}

function ComprehensionStep({ questions }: { questions: ComprehensionQuestion[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">内容を確認しよう</p>
      {questions.map((q, i) => (
        <details key={i} className="group rounded-2xl border border-gray-100 bg-white p-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-gray-800">
            <span className="text-indigo-400">Q{i + 1}.</span> {q.question}
            {q.choices && (
              <span className="mt-1.5 block text-xs font-normal text-gray-400">
                {q.choices.join(" / ")}
              </span>
            )}
          </summary>
          <p className="mt-2 text-sm text-indigo-600">答え: {q.answerJa}</p>
        </details>
      ))}
    </div>
  )
}

function KeyExpressionsStep({ items }: { items: KeyExpression[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">今日の重要表現</p>
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-bold text-indigo-600">{item.phrase}</p>
          <p className="mt-1 text-xs text-amber-700">{item.meaningJa}</p>
          {item.reusedFromDay && (
            <p className="mt-1.5 text-xs text-amber-500">Day{item.reusedFromDay}で学んだ表現の再登場だよ</p>
          )}
        </div>
      ))}
    </div>
  )
}

function GuidedPracticeStep({ items }: { items: GuidedPracticeItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">練習してみよう</p>
      {items.map((item, i) => (
        <details key={i} className="group rounded-2xl border border-gray-100 bg-white p-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-gray-800">
            <span className="mr-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-500">
              {item.instruction}
            </span>
            <span className="mt-1.5 block whitespace-pre-line">{item.prompt}</span>
          </summary>
          <p className="mt-2 text-sm text-indigo-600">答え: {item.answer}</p>
        </details>
      ))}
    </div>
  )
}

function WritingStep({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        いよいよWriting！今日の表現を使って書いてみよう
      </p>

      <div className="rounded-2xl bg-gray-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Question</p>
        <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-800">{lesson.prompt}</p>
      </div>

      <div className="flex gap-3 text-sm text-gray-400">
        <span>{lesson.wordCount.min}–{lesson.wordCount.max} words</span>
        <span>·</span>
        <span>{lesson.timeLimit} min</span>
      </div>

      <Link
        href={`/lessons/${lesson.id}/writing`}
        className="mt-2 flex h-14 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Start Writing →
      </Link>
    </div>
  )
}
