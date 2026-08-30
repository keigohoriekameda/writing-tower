import type { SupabaseClient } from "@supabase/supabase-js"
import { checkProductAccess } from "@/lib/auth/products"

export type AuthenticatedStudent = {
  userId: string
  loginId: string
}

/**
 * Resolves the current Supabase Auth session into a usable student, or
 * null if there is no session, the profile is inactive, or product access
 * for Writing Tower has not been granted. Used both to gate the login
 * screen and, independently, by useProgress so pages that aren't wrapped
 * in StudentGate (e.g. the writing/lesson pages) can still resolve "who is
 * this" without relying on React context.
 */
export async function resolveAuthenticatedStudent(
  supabase: SupabaseClient
): Promise<AuthenticatedStudent | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    // "no session yet" is the normal signed-out state, not a failure.
    if (userError.name !== "AuthSessionMissingError") {
      console.error("[writing-tower] failed to resolve auth session", userError)
    }
    return null
  }
  if (!userData.user) return null

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("login_id, is_active")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileError) {
    console.error("[writing-tower] failed to load profile", profileError)
    return null
  }
  if (!profile || !profile.is_active) return null

  const hasAccess = await checkProductAccess(supabase, userData.user.id)
  if (!hasAccess) return null

  return { userId: userData.user.id, loginId: profile.login_id as string }
}
