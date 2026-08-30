"use server"

import { redirect } from "next/navigation"

import { loadValidatedSession } from "@/lib/auth/current-user"
import { loginIdToInternalEmail, normalizeLoginId } from "@/lib/auth/login-id"
import { createClient } from "@/lib/supabase/server"

const GENERIC_LOGIN_ERROR = "IDまたはパスワードを確認してください。"
const SERVER_ERROR = "現在ログインできません。時間をおいてもう一度お試しください。"

export type LoginState = {
  error: string | null
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const rawLoginId = formData.get("login_id")
  const rawPassword = formData.get("password")

  if (typeof rawLoginId !== "string" || typeof rawPassword !== "string" || rawPassword.length === 0) {
    return { error: GENERIC_LOGIN_ERROR }
  }

  const loginId = normalizeLoginId(rawLoginId)
  if (loginId.length === 0) {
    return { error: GENERIC_LOGIN_ERROR }
  }

  let internalEmail: string
  try {
    internalEmail = loginIdToInternalEmail(loginId)
  } catch {
    console.error("[auth] login is unavailable: server configuration is incomplete")
    return { error: SERVER_ERROR }
  }

  const supabase = await createClient()

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: internalEmail,
    password: rawPassword,
  })

  if (signInError || !signInData.user) {
    return { error: GENERIC_LOGIN_ERROR }
  }

  const session = await loadValidatedSession(supabase, signInData.user.id, {
    expectedLoginId: loginId,
  })

  if (!session) {
    await supabase.auth.signOut()
    return { error: GENERIC_LOGIN_ERROR }
  }

  redirect("/")
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
