import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env"

let browserClient: SupabaseClient | undefined

/**
 * Writing Tower is a fully client-rendered app (no server-side session
 * gating today), so a plain supabase-js client with its default
 * localStorage-backed session is enough — this mirrors the Project
 * Skyline family's Supabase project/auth setup without pulling in
 * @supabase/ssr's cookie machinery that this app doesn't otherwise need.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(getSupabaseUrl(), getSupabasePublishableKey())
  }
  return browserClient
}
