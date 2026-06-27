"use client"

import { useProgress } from "@/hooks/useProgress"
import BuildingProgress from "@/components/BuildingProgress"

export default function BuildingProgressClient() {
  const { progress } = useProgress()
  return (
    <BuildingProgress
      completedDays={progress.completedDays.length}
      totalDays={90}
    />
  )
}
