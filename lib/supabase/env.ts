export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set")
  return url
}

export function getSupabasePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set")
  return key
}

export function getAuthInternalEmailDomain(): string {
  const domain = process.env.NEXT_PUBLIC_AUTH_INTERNAL_EMAIL_DOMAIN
  if (!domain) throw new Error("NEXT_PUBLIC_AUTH_INTERNAL_EMAIL_DOMAIN is not set")
  return domain
}
