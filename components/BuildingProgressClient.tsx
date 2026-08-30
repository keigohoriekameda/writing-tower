"use client"

import { useProgress } from "@/hooks/useProgress"
import BuildingProgress from "@/components/BuildingProgress"

export default function BuildingProgressClient() {
  const { progress, saveError } = useProgress()
  return (
    <div>
      <BuildingProgress
        completedDays={progress.completedDays.length}
        totalDays={90}
      />
      {saveError && <p className="mt-2 text-center text-xs text-red-500">{saveError}</p>}
    </div>
  )
}
