"use client"

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { loadLocalProgress, saveLocalProgress } from "@/lib/localProgress"
import { getCloudProgress, completeDayCloud } from "@/lib/progress/cloud"
import { ProgressSync, SyncSnapshot } from "@/lib/progress/sync"
import { useStudent } from "@/components/StudentGate"

const LOAD_ERROR_MESSAGE =
  "進捗をサーバーから読み込めませんでした。表示中の進捗は端末に保存されたものです。"
const SAVE_ERROR_MESSAGE =
  "進捗をサーバーに保存できませんでした。この端末には保存されています。通信状態を確認して「再同期」を押してください。"

const SERVER_SNAPSHOT: SyncSnapshot = { progress: { completedDays: [] }, status: "ok" }

/**
 * Progress for the signed-in student (must be rendered inside StudentGate).
 * A fresh ProgressSync is created per student, so switching accounts can
 * never carry one student's days into another's view.
 */
export function useProgress() {
  const { userId, studentId } = useStudent()

  const sync = useMemo(() => {
    const supabase = createSupabaseBrowserClient()
    return new ProgressSync(
      {
        getProgress: () => getCloudProgress(supabase, userId),
        completeDay: (day) => completeDayCloud(supabase, day),
      },
      {
        load: () => loadLocalProgress(studentId),
        save: (p) => saveLocalProgress(studentId, p),
      }
    )
  }, [userId, studentId])

  const snapshot = useSyncExternalStore(sync.subscribe, sync.getSnapshot, () => SERVER_SNAPSHOT)

  useEffect(() => {
    void sync.load()
    const onOnline = () => void sync.resync()
    window.addEventListener("online", onOnline)
    return () => window.removeEventListener("online", onOnline)
  }, [sync])

  const completeDay = useCallback((day: number) => sync.complete(day), [sync])
  const resync = useCallback(() => sync.resync(), [sync])

  const isDayCompleted = useCallback(
    (day: number) => snapshot.progress.completedDays.some((d) => d.day === day),
    [snapshot]
  )

  const saveError =
    snapshot.status === "loadFailed"
      ? LOAD_ERROR_MESSAGE
      : snapshot.status === "saveFailed"
        ? SAVE_ERROR_MESSAGE
        : null

  return { progress: snapshot.progress, completeDay, isDayCompleted, saveError, resync }
}
