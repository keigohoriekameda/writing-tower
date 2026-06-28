"use client"

import { createContext, useContext, useState, useEffect } from "react"

const STUDENT_ID_KEY = "writing-tower-student-id"

type StudentContextValue = {
  studentId: string
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
  const [studentId, setStudentId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [mounted, setMounted] = useState(false)
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STUDENT_ID_KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudentId(stored)
    setMounted(true)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim().toLowerCase()
    if (!trimmed) return
    localStorage.setItem(STUDENT_ID_KEY, trimmed)
    setStudentId(trimmed)
    setInput("")
    setSwitching(false)
  }

  function handleSwitch() {
    setSwitching(true)
    setInput("")
  }

  if (!mounted) return null

  if (!studentId || switching) {
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
            <p className="mb-1 text-sm font-bold text-gray-800">生徒IDを入力してください</p>
            <p className="mb-4 text-xs text-gray-400">
              例：s001, s002（先生から配布されたIDを入力）
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例：s001"
                autoFocus
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-12 rounded-full bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400"
              >
                はじめる →
              </button>
              {switching && (
                <button
                  type="button"
                  onClick={() => setSwitching(false)}
                  className="text-center text-xs text-gray-400 underline"
                >
                  キャンセル
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <StudentContext.Provider value={{ studentId, onSwitch: handleSwitch }}>
      <div key={studentId}>{children}</div>
    </StudentContext.Provider>
  )
}
