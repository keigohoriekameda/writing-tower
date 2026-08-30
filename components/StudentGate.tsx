"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { normalizeLoginId, loginIdToInternalEmail } from "@/lib/auth/loginId"
import { resolveAuthenticatedStudent, AuthenticatedStudent } from "@/lib/auth/session"

const GENERIC_LOGIN_ERROR =
  "IDまたはパスワードが正しくないか、Writing Towerの利用権限がありません。先生にご確認ください。"

type StudentContextValue = {
  studentId: string
  userId: string
  onSwitch: () => void
}

const StudentContext = createContext<StudentContextValue | null>(null)

export function useStudent(): StudentContextValue {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error("useStudent must be used within StudentGate")
  return ctx
}

export function StudentBadge() {
  const { studentId, onSwitch } = useStudent()
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        {studentId}
      </span>
      <button
        onClick={onSwitch}
        className="text-xs text-gray-400 transition-colors hover:text-gray-600"
      >
        切替
      </button>
    </div>
  )
}

type Props = { children: React.ReactNode }

export default function StudentGate({ children }: Props) {
  // undefined = still checking for an existing session, null = signed out
  const [student, setStudent] = useState<AuthenticatedStudent | null | undefined>(undefined)
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      const supabase = createSupabaseBrowserClient()
      const resolved = await resolveAuthenticatedStudent(supabase)
      if (!cancelled) {
        setStudent(resolved)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedId = loginId.trim()
    if (!trimmedId || !password) return

    setSubmitting(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const email = loginIdToInternalEmail(normalizeLoginId(trimmedId))

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      console.error("[writing-tower] sign-in failed", signInError)
      setError(GENERIC_LOGIN_ERROR)
      setSubmitting(false)
      return
    }

    const resolved = await resolveAuthenticatedStudent(supabase)
    if (!resolved) {
      await supabase.auth.signOut()
      setError(GENERIC_LOGIN_ERROR)
      setSubmitting(false)
      return
    }

    setStudent(resolved)
    setPassword("")
    setSubmitting(false)
  }

  const handleSwitch = useCallback(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.signOut().catch((err) => {
      console.error("[writing-tower] sign-out failed", err)
    })
    setStudent(null)
    setLoginId("")
    setPassword("")
    setError(null)
  }, [])

  if (student === undefined) return null

  if (!student) {
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
            <p className="mb-1 text-sm font-bold text-gray-800">IDとパスワードを入力してください</p>
            <p className="mb-4 text-xs text-gray-400">
              例：s001（先生から配布されたIDとパスワードを入力）
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="例：s001"
                autoFocus
                autoComplete="username"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={!loginId.trim() || !password || submitting}
                className="h-12 rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400"
              >
                {submitting ? "確認中…" : "はじめる →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <StudentContext.Provider
      value={{ studentId: student.loginId, userId: student.userId, onSwitch: handleSwitch }}
    >
      <div key={student.userId}>{children}</div>
    </StudentContext.Provider>
  )
}
