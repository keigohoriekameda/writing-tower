import { redirect } from "next/navigation"

import { loadValidatedSession } from "@/lib/auth/current-user"
import { createClient } from "@/lib/supabase/server"

import { LoginForm } from "./LoginForm"

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const session = await loadValidatedSession(supabase, user.id)
    if (session) {
      redirect("/")
    }
    await supabase.auth.signOut()
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            HK Education · AI Learning Series
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Writing Tower</h1>
          <p className="mt-1 text-sm text-gray-400">Build Your Future.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="mb-1 text-sm font-bold text-gray-800">IDとパスワードでログインしてください</p>
          <p className="mb-4 text-xs text-gray-400">先生から配布されたIDとパスワードを入力してください。</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
