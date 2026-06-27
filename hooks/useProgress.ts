"use client"

import { useSyncExternalStore, useCallback } from "react"
import { Progress } from "@/types/progress"
import { loadProgress, saveProgress, addCompletedDay } from "@/lib/mockProgress"

const PROGRESS_EVENT = "writing-tower-progress-update"

function subscribe(callback: () => void): () => void {
  window.addEventListener(PROGRESS_EVENT, callback)
  return () => window.removeEventListener(PROGRESS_EVENT, callback)
}

const emptyProgress: Progress = { completedDays: [] }

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, loadProgress, () => emptyProgress)

  const completeDay = useCallback((day: number) => {
    const current = loadProgress()
    const next = addCompletedDay(current, day)
    if (next === current) return
    saveProgress(next)
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  }, [])

  const isDayCompleted = useCallback(
    (day: number) => progress.completedDays.some((d) => d.day === day),
    [progress]
  )

  return { progress, completeDay, isDayCompleted }
}
