import BuildingProgressClient from "@/components/BuildingProgressClient"
import WelcomeCard from "@/components/WelcomeCard"
import DailyMessage from "@/components/DailyMessage"
import NextLessonClient from "@/components/NextLessonClient"
import StudentGate, { StudentBadge } from "@/components/StudentGate"

export default function Home() {
  return (
    <StudentGate>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-14">
      <header className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
          HK Education · AI Learning Series
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Writing Tower</h1>
          <StudentBadge />
        </div>
        <p className="mt-0.5 text-sm font-medium text-indigo-500">英検準2級ライティング</p>
        <p className="mt-0.5 text-sm text-gray-400">Build Your Future.</p>
      </header>

      <div className="mb-6">
        <WelcomeCard />
      </div>

      <div className="mb-2">
        <BuildingProgressClient />
      </div>

      <div className="mb-6">
        <DailyMessage />
      </div>

      <div className="mb-5 rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 px-5 py-4 text-center">
        <p className="text-sm font-bold text-indigo-700">🎯 ✨ 今日のミッション！</p>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
          下のカードをタップして、
          <br />
          <span className="font-bold text-indigo-600">1階建設</span>を始めよう！ ↓
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-400">今日のレッスン</h2>
        <NextLessonClient />
      </section>
    </main>
    </StudentGate>
  )
}
