export type DayProgress = {
  day: number
  completedAt: string
}

export type Progress = {
  completedDays: DayProgress[]
}
