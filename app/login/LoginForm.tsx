"use client"

import { useActionState } from "react"

import { login, type LoginState } from "@/actions/auth"

const initialState: LoginState = { error: null }

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        id="login_id"
        name="login_id"
        type="text"
        required
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="例：s001"
        autoFocus
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="パスワード"
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      <div aria-live="polite" className="min-h-4 text-xs text-red-500">
        {state.error}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400"
      >
        {pending ? "ログイン中..." : "はじめる →"}
      </button>
    </form>
  )
}
