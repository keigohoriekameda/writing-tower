"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Progress } from "@/types/progress"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { resolveAuthenticatedStudent, AuthenticatedStudent } from "@/lib/auth/session"
import { loadLocalProgress, saveLocalProgress, unionProgress, addCompletedDay } from "@/lib/localProgress"
import { getCloudProgress, completeDayCloud } from "@/lib/progress/cloud"

const LOAD_ERROR_MESSAGE =
  "進捗をサーバーから読み込めませんでした。表示中の進捗は端末に保存されたものです。"
const SAVE_ERROR_MESSAGE =
  "進捗を保存できませんでした。ネットワーク状態をご確認のうえ、後ほど再度お試しください。"

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({ completedDays: [] })
  const [saveError, setSaveError] = useState<string | null>(null)
  const progressRef = useRef<Progress>({ completedDays: [] })
  const studentPromiseRef = useRef<Promise<AuthenticatedStudent | null> | null>(null)

  const applyProgress = useCallback((next: Progress) => {
    progressRef.current = next
    setProgress(next)
  }, [])

  useEffect(() => {
    let cancelled = false
    const supabase = createSupabaseBrowserClient()
    const studentPromise = resolveAuthenticatedStudent(supabase)
    studentPromiseRef.current = studentPromise

    async function init() {
      const student = await studentPromise
      if (!student || cancelled) return

      const local = loadLocalProgress(student.loginId)

      let cloud: Progress
      try {
        cloud = await getCloudProgress(supabase, student.userId)
      } catch (err) {
        console.error("[writing-tower] failed to load cloud progress", err)
        if (!cancelled) {
          setSaveError(LOAD_ERROR_MESSAGE)
          // Cloud is unreachable — fall back to the local cache rather than
          // resetting to an empty (Day 1) state.
          applyProgress(local)
        }
        return
      }

      // Cloud is authoritative, but rescue any days the local cache has
      // that the cloud doesn't (private-browsing/pre-migration data) by
      // merging up rather than ever overwriting cloud with local.
      const merged = unionProgress(cloud, local)
      if (!cancelled) applyProgress(merged)
      saveLocalProgress(student.loginId, merged)

      const missingFromCloud = merged.completedDays.filter(
        (day) => !cloud.completedDays.some((c) => c.day === day.day)
      )
      for (const missing of missingFromCloud) {
        try {
          await completeDayCloud(supabase, missing.day)
        } catch (err) {
          console.error(`[writing-tower] failed to sync Day ${missing.day} to Supabase`, err)
          if (!cancelled) setSaveError(SAVE_ERROR_MESSAGE)
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [applyProgress])

  const completeDay = useCallback(
    (day: number) => {
      const next = addCompletedDay(progressRef.current, day)
      const changed = next !== progressRef.current
      if (changed) applyProgress(next)

      void (async () => {
        // Wait for the same session resolution useProgress's own init
        // kicked off, so a completion fired right on mount (see
        // FeedbackView) never races ahead of knowing who the user is.
        const student = await studentPromiseRef.current
        if (!student) return
        if (changed) saveLocalProgress(student.loginId, next)

        const supabase = createSupabaseBrowserClient()
        try {
          await completeDayCloud(supabase, day)
        } catch (err) {
          console.error(`[writing-tower] failed to save Day ${day} to Supabase`, err)
          setSaveError(SAVE_ERROR_MESSAGE)
        }
      })()
    },
    [applyProgress]
  )

  const isDayCompleted = useCallback(
    (day: number) => progress.completedDays.some((d) => d.day === day),
    [progress]
  )

  return { progress, completeDay, isDayCompleted, saveError }
}
