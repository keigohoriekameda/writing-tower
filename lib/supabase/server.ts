import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env"

/**
 * A per-request Supabase client acting AS the caller: it carries the
 * caller's access token, so RLS and `auth.uid()` inside RPCs resolve to
 * that user. Only the publishable key is used — no service-role key is
 * needed or read by this app. Nothing is persisted between requests.
 */
export function createSupabaseServerClient(accessToken: string): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}
