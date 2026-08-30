"use client"

import { useContext } from "react"
import { ProgressContext, ProgressContextValue } from "@/components/StudentGate"

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress must be used within StudentGate")
  return ctx
}
