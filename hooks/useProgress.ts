"use client"

import { useState, useEffect, useCallback } from "react"
import { Progress } from "@/types/progress"
import { loadProgress, saveProgress, addCompletedDay } from "@/lib/mockProgress"

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({ completedDays: [] })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress())
  }, [])

  const completeDay = useCallback((day: number) => {
    setProgress((prev) => {
      const next = addCompletedDay(prev, day)
      if (next === prev) return prev
      saveProgress(next)
      return next
    })
  }, [])

  const isDayCompleted = useCallback(
    (day: number) => progress.completedDays.some((d) => d.day === day),
    [progress]
  )

  return { progress, completeDay, isDayCompleted }
}
