import { getAuthInternalEmailDomain } from "@/lib/supabase/env"

/**
 * Mirrors the Project Skyline family's login-id convention (see
 * skyline-j3-social-history / project-skyline-admin): students sign in
 * with a `login_id`, not a real email address, and the app maps it to a
 * synthetic Supabase Auth email under a shared internal domain.
 */
export function normalizeLoginId(rawLoginId: string): string {
  return rawLoginId.trim().toLowerCase()
}

export function loginIdToInternalEmail(normalizedLoginId: string): string {
  return `${normalizedLoginId}@${getAuthInternalEmailDomain()}`
}
