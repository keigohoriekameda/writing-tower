import type { SupabaseClient } from "@supabase/supabase-js"
import { getProductAccess } from "@/lib/auth/products"

export type AuthenticatedStudent = {
  userId: string
  loginId: string
}

export type StudentAccessResult =
  | { status: "ok"; student: AuthenticatedStudent }
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "error" }

/**
 * Resolves a Supabase Auth session into a usable student, distinguishing
 * "not signed in" from "signed in but not allowed" from "lookup failed".
 *
 * Pass `accessToken` on the server: `getUser(jwt)` then verifies the token
 * with Supabase Auth itself (never trusting client-claimed ids). In the
 * browser omit it and the client's own stored session is used.
 */
export async function resolveStudentAccess(
  supabase: SupabaseClient,
  accessToken?: string
): Promise<StudentAccessResult> {
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken)
  if (userError) {
    // "no session yet" is the normal signed-out state, not a failure.
    if (userError.name !== "AuthSessionMissingError") {
      console.error("[writing-tower] failed to resolve auth session", userError.name)
    }
    // Auth-server outages (5xx / network) are not the same as a bad token.
    const status = (userError as { status?: number }).status
    if (status !== undefined && status >= 500) return { status: "error" }
    if (userError.name === "AuthRetryableFetchError") return { status: "error" }
    return { status: "unauthenticated" }
  }
  if (!userData.user) return { status: "unauthenticated" }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("login_id, is_active")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileError) {
    console.error("[writing-tower] failed to load profile", profileError.code)
    return { status: "error" }
  }
  if (!profile || !profile.is_active) return { status: "forbidden" }

  const access = await getProductAccess(supabase, userData.user.id)
  if (access === "error") return { status: "error" }
  if (access === "denied") return { status: "forbidden" }

  return {
    status: "ok",
    student: { userId: userData.user.id, loginId: profile.login_id as string },
  }
}

/**
 * Browser-side convenience used by the login gate: the current student, or
 * null for any reason they can't use the app.
 */
export async function resolveAuthenticatedStudent(
  supabase: SupabaseClient
): Promise<AuthenticatedStudent | null> {
  const result = await resolveStudentAccess(supabase)
  return result.status === "ok" ? result.student : null
}
