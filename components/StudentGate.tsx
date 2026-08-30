"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

import { logout } from "@/actions/auth"
import { completeDayCloud, getCloudProgress } from "@/actions/progress"
import { addCompletedDay, loadProgress, saveProgress } from "@/lib/mockProgress"
import { diffMissingDays, mergeProgress } from "@/lib/progress"
import { Progress } from "@/types/progress"

type StudentContextValue = {
  studentId: string
}

const StudentContext = createContext<StudentContextValue | null>(null)

export function useStudent(): StudentContextValue {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error("useStudent must be used within StudentGate")
  return ctx
}

export function StudentBadge() {
  const { studentId } = useStudent()
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        {studentId}
      </span>
      <form action={logout}>
        <button
          type="submit"
          className="text-xs text-gray-400 transition-colors hover:text-gray-600"
        >
          ログアウト
        </button>
      </form>
    </div>
  )
}

export type ProgressContextValue = {
  progress: Progress
  completeDay: (day: number) => void
  isDayCompleted: (day: number) => boolean
  isLoading: boolean
  saveError: string | null
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

type Props = { loginId: string; children: React.ReactNode }

export default function StudentGate({ loginId, children }: Props) {
  const [progress, setProgress] = useState<Progress>({ completedDays: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    // ログインIDが変わることは通常無いが、切り替わった場合に前のユーザーの状態が
    // 一瞬でも見えないよう読み込み中に戻す
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)

    async function sync() {
      // 起動時はSupabaseを正とするが、取得が終わるまでの間や通信失敗時に
      // Day1へ戻ってしまわないよう、ローカルキャッシュを先に表示しておく
      const local = loadProgress(loginId)
      if (!cancelled && local.completedDays.length > 0) {
        setProgress(local)
      }

      const result = await getCloudProgress()
      if (cancelled) return

      if (!result.ok) {
        console.error("[progress] cloud fetch failed:", result.message)
        setSaveError("進捗を取得できませんでした。オフラインのデータを表示しています。")
        setProgress(local)
        setIsLoading(false)
        return
      }

      // クラウドとローカルの進捗をunionし、より進んでいる方を残す（後退させない）
      const merged = mergeProgress(local, result.progress)
      setProgress(merged)
      saveProgress(loginId, merged)
      setIsLoading(false)

      // ローカルにのみ存在する完了Dayをクラウドへ反映する（例：ローカルDay5・クラウドDay3 → Day5までマージ）。
      // クラウドの方が進んでいるDayは対象に含まれないため、クラウドを後退させることはない。
      const missingInCloud = diffMissingDays(local, result.progress)
      for (const day of missingInCloud) {
        const pushResult = await completeDayCloud(day)
        if (cancelled) return
        if (!pushResult.ok) {
          console.error(`[progress] failed to sync local day ${day} to cloud:`, pushResult.message)
          setSaveError("一部の進捗をクラウドへ保存できませんでした。")
        }
      }
    }

    sync()

    return () => {
      cancelled = true
    }
  }, [loginId])

  const completeDay = useCallback((day: number) => {
    setProgress((prev) => {
      const next = addCompletedDay(prev, day)
      if (next === prev) return prev
      saveProgress(loginId, next)
      return next
    })

    completeDayCloud(day)
      .then((result) => {
        if (!result.ok) {
          console.error(`[progress] failed to save day ${day} to cloud:`, result.message)
          setSaveError("進捗を保存できませんでした。通信状態を確認してください。")
        } else {
          setSaveError(null)
        }
      })
      .catch((err) => {
        console.error(`[progress] unexpected error saving day ${day} to cloud:`, err)
        setSaveError("進捗を保存できませんでした。通信状態を確認してください。")
      })
  }, [loginId])

  const isDayCompleted = useCallback(
    (day: number) => progress.completedDays.some((d) => d.day === day),
    [progress],
  )

  return (
    <StudentContext.Provider value={{ studentId: loginId }}>
      <ProgressContext.Provider value={{ progress, completeDay, isDayCompleted, isLoading, saveError }}>
        {children}
      </ProgressContext.Provider>
    </StudentContext.Provider>
  )
}
