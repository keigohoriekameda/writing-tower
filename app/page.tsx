import { lessons } from "@/data/lessons"
import LessonCard from "@/components/LessonCard"
import BuildingProgressClient from "@/components/BuildingProgressClient"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-14">
      <header className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
          HK Education · AI Learning Series
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Writing Tower</h1>
        <p className="mt-1 text-sm text-gray-400">Build Your Future.</p>
      </header>

      <div className="mb-8">
        <BuildingProgressClient />
      </div>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Lessons
        </h2>
        <div className="flex flex-col gap-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>
    </main>
  )
}
