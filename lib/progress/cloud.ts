import type { SupabaseClient } from "@supabase/supabase-js"
import { Progress } from "@/types/progress"
import { PRODUCT_CODE } from "@/lib/productCode"

/**
 * Reads this student's Writing Tower progress from Supabase
 * (`wt_day_progress`, select-own-row RLS). Throws on failure — callers
 * decide how to degrade (see useProgress), but must never swallow this
 * silently.
 */
export async function getCloudProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<Progress> {
  const { data, error } = await supabase
    .from("wt_day_progress")
    .select("day, completed_at")
    .eq("user_id", userId)
    .eq("product_id", PRODUCT_CODE)

  if (error) throw error

  return {
    completedDays: (data ?? []).map((row) => ({
      day: row.day as number,
      completedAt: row.completed_at as string,
    })),
  }
}

/**
 * Marks a day complete via the `wt_complete_day` SECURITY DEFINER RPC
 * (idempotent — re-completing an already-completed day is a no-op).
 * Throws on failure so callers can surface it instead of losing it.
 */
export async function completeDayCloud(supabase: SupabaseClient, day: number): Promise<void> {
  const { error } = await supabase.rpc("wt_complete_day", { p_day: day })
  if (error) throw error
}
