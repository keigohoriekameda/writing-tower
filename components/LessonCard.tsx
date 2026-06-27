import Link from "next/link"
import { Lesson } from "@/types/lesson"

type Props = {
  lesson: Lesson
}

export default function LessonCard({ lesson }: Props) {
  return (
    <Link href={`/lessons/${lesson.id}`} className="group block">
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-400">Day {lesson.day}</span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-600">
              {lesson.type}
            </span>
          </div>
          <p className="text-base font-semibold text-gray-900">{lesson.title}</p>
          <p className="text-sm text-gray-400">
            {lesson.wordCount.min}–{lesson.wordCount.max} words · {lesson.timeLimit} min
          </p>
        </div>
        <span className="text-gray-300 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}
