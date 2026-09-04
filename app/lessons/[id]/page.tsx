import Link from "next/link"
import { notFound } from "next/navigation"
import { getLessonById } from "@/data/lessons"
import LessonFlowClient from "@/components/LessonFlowClient"

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

      <LessonFlowClient lesson={lesson} />
    </main>
  )
}
