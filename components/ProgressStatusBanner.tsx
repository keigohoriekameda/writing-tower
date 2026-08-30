"use client"

import { useProgress } from "@/hooks/useProgress"

export default function ProgressStatusBanner() {
  const { saveError } = useProgress()

  if (!saveError) return null

  return (
    <div className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-700">
      ⚠️ {saveError}
    </div>
  )
}
