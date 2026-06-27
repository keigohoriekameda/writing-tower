import Building from "@/components/Building"

type Props = {
  completedDays: number
  totalDays?: number
}

export default function BuildingProgress({ completedDays, totalDays = 90 }: Props) {
  const isComplete = totalDays > 0 && completedDays >= totalDays

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Your Tower
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-700">
          {completedDays > 0
            ? `${completedDays} floor${completedDays !== 1 ? "s" : ""} built`
            : "Ready to build"}
        </p>
      </div>

      <div className="flex justify-center py-2">
        <Building currentFloor={completedDays} totalFloors={totalDays} animated />
      </div>

      {completedDays === 0 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Complete Day 1 to lay the first floor!
        </p>
      )}

      {isComplete && (
        <p className="mt-3 text-center text-sm font-semibold text-green-600">
          Tower Complete!
        </p>
      )}
    </div>
  )
}
