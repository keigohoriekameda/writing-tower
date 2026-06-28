import Link from "next/link"
import { notFound } from "next/navigation"
import { getLessonById } from "@/data/lessons"

type Props = {
  params: Promise<{ id: string }>
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params
  const lesson = getLessonById(id)

  if (!lesson) notFound()

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-14">
      <Link
        href="/"
        className="mb-10 flex w-fit items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-600"
      >
        ← Back
      </Link>

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
    </main>
  )
}
