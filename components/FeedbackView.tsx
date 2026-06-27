import Link from "next/link"
import { FeedbackResult } from "@/types/feedback"

type Props = {
  feedback: FeedbackResult
  day: number
}

export default function FeedbackView({ feedback, day }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {feedback.isMock && (
        <div className="rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-600">
          Demo mode — add OPENAI_API_KEY to .env.local for real feedback.
        </div>
      )}

      {/* ① Praise */}
      <div className="rounded-2xl bg-indigo-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Great Work!
        </p>
        <p className="mt-2 text-sm leading-relaxed text-indigo-900">{feedback.praise}</p>
      </div>

      {/* ② Good Points */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Good Points
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {feedback.goodPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 text-green-500">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* ③ One Improvement */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          One Improvement
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{feedback.oneImprovement}</p>
      </div>

      {/* ④ Example */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Example</p>
        <p className="mt-2 text-sm italic leading-relaxed text-gray-600">{feedback.example}</p>
      </div>

      {/* ⑤ Building Completion */}
      <div className="rounded-2xl bg-green-50 p-6 text-center">
        <p className="text-2xl">🏗️</p>
        <p className="mt-2 text-sm font-semibold text-green-700">Day {day} Complete!</p>
        <p className="mt-1 text-xs text-green-500">Your tower is growing. Keep building.</p>
      </div>

      <Link
        href="/"
        className="flex h-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </div>
  )
}
