"use server"

import { WRITING_TOWER_PRODUCT_CODE, getCurrentUser } from "@/lib/auth/current-user"
import { createClient } from "@/lib/supabase/server"
import type { DayProgress, Progress } from "@/types/progress"

const NOT_AUTHENTICATED_MESSAGE = "ログインが必要です。"
const LOAD_ERROR_MESSAGE = "進捗を取得できませんでした。"
const SAVE_ERROR_MESSAGE = "進捗を保存できませんでした。"

export type CloudProgressResult = { ok: true; progress: Progress } | { ok: false; message: string }

// 起動時はこのSupabase上の進捗を正とする（クラウドが真実の情報源）。
// 取得に失敗した場合も呼び出し側でDay1へ初期化しないよう、エラーのみを返し進捗は返さない。
// ネットワーク自体の例外（fetch失敗等）も含め、呼び出し元へ必ずok:falseとして返す
// （未処理のPromise rejectionにしない）。
export async function getCloudProgress(): Promise<CloudProgressResult> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { ok: false, message: NOT_AUTHENTICATED_MESSAGE }
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("writing_tower_progress")
      .select("day_number, completed_at")
      .eq("user_id", session.userId)
      .eq("product_id", WRITING_TOWER_PRODUCT_CODE)

    if (error) {
      console.error("[progress] failed to load cloud progress:", error)
      return { ok: false, message: LOAD_ERROR_MESSAGE }
    }

    const completedDays: DayProgress[] = (data ?? [])
      .map((row) => ({
        day: row.day_number,
        completedAt: row.completed_at ?? new Date().toISOString(),
      }))
      .sort((a, b) => a.day - b.day)

    return { ok: true, progress: { completedDays } }
  } catch (err) {
    console.error("[progress] unexpected error loading cloud progress:", err)
    return { ok: false, message: LOAD_ERROR_MESSAGE }
  }
}

export type CompleteDayResult = { ok: true; newlyCompleted: boolean } | { ok: false; message: string }

// complete_writing_tower_day RPC経由でのみ書き込む（ON CONFLICT DO NOTHINGのため冪等・
// 既存行を後退させない）。呼び出し元のuser_idはSessionからではなくRPC内のauth.uid()から
// 取得されるため、ここではuser_idを渡さない。ネットワーク自体の例外も必ずok:falseとして返す。
export async function completeDayCloud(day: number): Promise<CompleteDayResult> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { ok: false, message: NOT_AUTHENTICATED_MESSAGE }
    }

    const supabase = await createClient()
    const { data, error } = await supabase.rpc("complete_writing_tower_day", { p_day_number: day })

    if (error) {
      console.error(`[progress] failed to save day ${day} to cloud:`, error)
      return { ok: false, message: SAVE_ERROR_MESSAGE }
    }

    return { ok: true, newlyCompleted: Boolean(data) }
  } catch (err) {
    console.error(`[progress] unexpected error saving day ${day} to cloud:`, err)
    return { ok: false, message: SAVE_ERROR_MESSAGE }
  }
}
