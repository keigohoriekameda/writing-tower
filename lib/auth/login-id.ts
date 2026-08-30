import "server-only"

import { getAuthInternalEmailDomain } from "@/lib/supabase/env"

export function normalizeLoginId(rawLoginId: string): string {
  return rawLoginId.trim().toLowerCase()
}

// normalizedLoginIdはnormalizeLoginId()適用済みであることが前提（空文字チェックは呼び出し側で行う）
export function loginIdToInternalEmail(normalizedLoginId: string): string {
  return `${normalizedLoginId}@${getAuthInternalEmailDomain()}`
}
