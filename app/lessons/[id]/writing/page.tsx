import Link from "next/link"
import { notFound } from "next/navigation"
import { getLessonById } from "@/data/lessons"
import WritingEditor from "@/components/WritingEditor"

type Props = {
  params: Promise<{ id: string }>
}

export default async function WritingPage({ params }: Props) {
  const { id } = await params
  const lesson = getLessonById(id)

  if (!lesson) notFound()

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-14">
      <Link
        href={`/lessons/${lesson.id}`}
        className="mb-8 flex w-fit items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-600"
      >
        ← Lesson
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-400">Day {lesson.day}</span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-indigo-600">
            {lesson.type}
          </span>
        </div>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-gray-900">{lesson.title}</h1>
      </div>

      <WritingEditor lesson={lesson} />
    </main>
  )
}
