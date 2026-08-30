import "server-only"

import { createClient } from "@/lib/supabase/server"

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export const WRITING_TOWER_PRODUCT_CODE = "writing-tower"

export type AuthenticatedContext = {
  userId: string
  loginId: string
  displayName: string
}

type ValidateOptions = {
  // ログイン直後のみ、入力されたlogin_idとprofiles.login_idの一致を確認する
  expectedLoginId?: string
}

// profiles / products / user_product_accessを確認し、Writing Towerを利用可能な状態かを判定する。
// 呼び出し元の責務でsignOut()するかどうかを判断できるよう、ここでは判定結果のみを返す
export async function loadValidatedSession(
  supabase: SupabaseServerClient,
  userId: string,
  options: ValidateOptions = {},
): Promise<AuthenticatedContext | null> {
  // profiles / products / user_product_accessは互いに依存しないため並行して取得し、
  // ページ遷移のたびに直列の往復が積み重なるのを避ける（判定条件自体は変更しない）
  const [{ data: profile }, { data: product }, { data: access }] = await Promise.all([
    supabase.from("profiles").select("id, login_id, display_name, is_active").eq("id", userId).maybeSingle(),
    supabase.from("products").select("product_code, is_active").eq("product_code", WRITING_TOWER_PRODUCT_CODE).maybeSingle(),
    supabase
      .from("user_product_access")
      .select("is_active, expires_at")
      .eq("user_id", userId)
      .eq("product_id", WRITING_TOWER_PRODUCT_CODE)
      .maybeSingle(),
  ])

  if (!profile || !profile.is_active) {
    return null
  }

  if (options.expectedLoginId !== undefined && profile.login_id !== options.expectedLoginId) {
    return null
  }

  if (!product || !product.is_active) {
    return null
  }

  if (!access || !access.is_active) {
    return null
  }

  if (access.expires_at !== null && new Date(access.expires_at).getTime() <= Date.now()) {
    return null
  }

  return {
    userId: profile.id,
    loginId: profile.login_id,
    displayName: profile.display_name,
  }
}

// 現在のSessionからauthenticated userを取得し、profiles/Product Accessを確認する。
// Sessionが無い、または確認に失敗した場合はnullを返す（signOut()は呼び出し側の責務）
export async function getCurrentUser(): Promise<AuthenticatedContext | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return loadValidatedSession(supabase, user.id)
}
