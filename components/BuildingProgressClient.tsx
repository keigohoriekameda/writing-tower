"use client"

import { useProgress } from "@/hooks/useProgress"
import BuildingProgress from "@/components/BuildingProgress"
import SyncErrorBanner from "@/components/SyncErrorBanner"

export default function BuildingProgressClient() {
  const { progress, saveError, resync } = useProgress()
  return (
    <div>
      <BuildingProgress
        completedDays={progress.completedDays.length}
        totalDays={90}
      />
      {saveError && <SyncErrorBanner className="mt-2" message={saveError} onResync={resync} />}
    </div>
  )
}
