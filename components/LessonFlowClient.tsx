"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ComprehensionQuestion,
  FillBlankPracticeItem,
  GuidedPracticeItem,
  KeyExpression,
  Lesson,
  LessonScene,
  WordOrderPracticeItem,
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
        <ComprehensionQuestionCard key={i} index={i} question={q} />
      ))}
    </div>
  )
}

function ComprehensionQuestionCard({ index, question }: { index: number; question: ComprehensionQuestion }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-sm font-medium text-gray-800">
        <span className="text-indigo-400">Q{index + 1}.</span> {question.questionJa}
      </p>

      {question.kind === "choice" ? (
        <div className="mt-3 flex flex-col gap-2">
          {question.choices.map((choice, i) => {
            const showResult = selected !== null
            const isCorrectChoice = i === question.correctIndex
            const isSelected = selected === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                disabled={showResult}
                className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${
                  showResult && isCorrectChoice
                    ? "border-green-300 bg-green-50 text-green-700"
                    : showResult && isSelected
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"
                }`}
              >
                <span>{choice}</span>
                {showResult && isCorrectChoice && <span>○</span>}
                {showResult && isSelected && !isCorrectChoice && <span>×</span>}
              </button>
            )
          })}
          {selected !== null && question.explanationJa && (
            <p className="mt-1 text-xs text-indigo-500">{question.explanationJa}</p>
          )}
        </div>
      ) : (
        <div className="mt-3">
          {revealed ? (
            <p className="text-sm text-indigo-600">答え: {question.answerJa}</p>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="rounded-full border border-indigo-200 px-4 py-1.5 text-xs font-medium text-indigo-500 transition-colors hover:bg-indigo-50"
            >
              答えを見る
            </button>
          )}
        </div>
      )}
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
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">練習してみよう</p>
      {items.map((item, i) =>
        item.kind === "wordOrder" ? (
          <WordOrderCard key={i} item={item} />
        ) : (
          <FillBlankCard key={i} item={item} />
        )
      )}
    </div>
  )
}

function ResultBadge({ isCorrect }: { isCorrect: boolean }) {
  return (
    <span className={`text-sm font-bold ${isCorrect ? "text-green-600" : "text-red-500"}`}>
      {isCorrect ? "○ 正解！" : "× 不正解"}
    </span>
  )
}

function WordOrderCard({ item }: { item: WordOrderPracticeItem }) {
  const [picked, setPicked] = useState<number[]>([])
  const [checked, setChecked] = useState(false)

  const isComplete = picked.length === item.tokens.length
  const isCorrect = picked.length === item.correctOrder.length && picked.every((v, i) => v === item.correctOrder[i])

  function pick(tokenIndex: number) {
    if (checked) return
    setPicked((p) => [...p, tokenIndex])
  }

  function removeAt(pickedPosition: number) {
    if (checked) return
    setPicked((p) => p.filter((_, i) => i !== pickedPosition))
  }

  function reset() {
    setPicked([])
    setChecked(false)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <span className="mb-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-500">
        {item.instruction}
      </span>

      <div className="mt-2 min-h-11 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-2">
        {picked.length === 0 ? (
          <span className="text-sm text-gray-300">タップした単語がここに並びます</span>
        ) : (
          picked.map((tokenIndex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => removeAt(i)}
              disabled={checked}
              className="mb-1.5 mr-1.5 inline-block rounded-lg bg-indigo-100 px-2.5 py-1 text-sm text-indigo-700 disabled:cursor-default"
            >
              {item.tokens[tokenIndex]}
            </button>
          ))
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {item.tokens.map((token, tokenIndex) => (
          <button
            key={tokenIndex}
            type="button"
            onClick={() => pick(tokenIndex)}
            disabled={picked.includes(tokenIndex) || checked}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-700 transition-colors hover:border-indigo-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {token}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        {!checked ? (
          <button
            type="button"
            onClick={() => setChecked(true)}
            disabled={!isComplete}
            className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            答え合わせ
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
          >
            もう一度
          </button>
        )}
        {checked && <ResultBadge isCorrect={isCorrect} />}
      </div>

      {checked && (
        <div className="mt-2">
          <p className="text-sm text-indigo-600">正しい英文: {item.answer}</p>
          {item.explanationJa && <p className="mt-1 text-xs text-gray-400">{item.explanationJa}</p>}
        </div>
      )}
    </div>
  )
}

function FillBlankCard({ item }: { item: FillBlankPracticeItem }) {
  const [selected, setSelected] = useState<number | null>(null)
  const isCorrect = selected === item.correctIndex

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <span className="mb-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-500">
        {item.instruction}
      </span>
      <p className="mt-1 whitespace-pre-line text-sm text-gray-800">{item.prompt}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {item.choices.map((choice, i) => {
          const showResult = selected !== null
          const isSelected = selected === i
          const isThisCorrect = i === item.correctIndex
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                showResult && isThisCorrect
                  ? "border-green-300 bg-green-50 text-green-700"
                  : showResult && isSelected
                    ? "border-red-300 bg-red-50 text-red-600"
                    : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"
              }`}
            >
              {choice}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="mt-2 flex items-center gap-2">
          <ResultBadge isCorrect={isCorrect} />
          {!isCorrect && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              もう一度
            </button>
          )}
        </div>
      )}
      {selected !== null && item.explanationJa && <p className="mt-1 text-xs text-gray-400">{item.explanationJa}</p>}
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
        {lesson.writingHintJa && (
          <p className="mt-3 rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-700">
            💡 {lesson.writingHintJa}
          </p>
        )}
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
