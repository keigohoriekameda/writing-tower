"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  currentFloor: number
  totalFloors?: number
  animated?: boolean
}

export default function Building({
  currentFloor,
  totalFloors = 90,
  animated = true,
}: Props) {
  const clamped = Math.max(0, Math.min(currentFloor, totalFloors))
  const progress = totalFloors > 0 ? clamped / totalFloors : 0
  const isComplete = totalFloors > 0 && clamped >= totalFloors

  const [glow, setGlow] = useState(false)
  const prevRef = useRef(clamped)

  useEffect(() => {
    if (animated && clamped > prevRef.current) {
      setGlow(true)
      const timer = setTimeout(() => setGlow(false), 900)
      prevRef.current = clamped
      return () => clearTimeout(timer)
    }
    prevRef.current = clamped
  }, [clamped, animated])

  // SVG layout constants
  const BX = 12   // building left
  const BY = 28   // building top
  const BW = 56   // building width
  const BH = 118  // building height

  const builtH = clamped > 0 ? Math.max(6, BH * progress) : 0
  const builtY = BY + BH - builtH

  const fillColor = isComplete ? "#10b981" : "#6366f1"

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 80 168"
        className="w-20 h-auto"
        aria-label={`Building: ${clamped} of ${totalFloors} floors complete`}
      >
        {/* ── Top decoration ────────────────────────── */}
        {isComplete ? (
          <>
            {/* Flagpole */}
            <line x1="40" y1="5" x2="40" y2={BY} stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            {/* Gold star */}
            <circle cx="40" cy="3.5" r="4" fill="#fbbf24" />
          </>
        ) : clamped > 0 ? (
          <>
            {/* Crane vertical mast */}
            <line x1="58" y1={BY + 2} x2="58" y2={Math.max(BY + 2, builtY)} stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            {/* Crane boom */}
            <line x1="36" y1="11" x2="66" y2="11" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            {/* Mast to boom joint */}
            <line x1="58" y1="11" x2="58" y2={BY + 2} stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            {/* Hook cable */}
            <line x1="58" y1="11" x2="58" y2="20" stroke="#9ca3af" strokeWidth="1" strokeDasharray="2,2" />
          </>
        ) : null}

        {/* ── Building shell ─────────────────────────── */}
        <rect
          x={BX} y={BY} width={BW} height={BH}
          fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5" rx="2"
        />

        {/* ── Built floors (grows from bottom) ──────── */}
        {builtH > 0 && (
          <rect
            x={BX}
            y={builtY}
            width={BW}
            height={builtH}
            fill={fillColor}
            rx="2"
            style={
              animated
                ? { transition: "y 0.65s cubic-bezier(0.34,1.56,0.64,1), height 0.65s cubic-bezier(0.34,1.56,0.64,1)" }
                : undefined
            }
          />
        )}

        {/* ── New-floor glow flash ───────────────────── */}
        {glow && builtH > 0 && (
          <rect
            x={BX}
            y={builtY}
            width={BW}
            height={Math.min(14, builtH)}
            fill="white"
            rx="2"
            opacity={0.4}
          />
        )}

        {/* ── Horizontal floor dividers ─────────────── */}
        {Array.from({ length: 8 }, (_, i) => {
          const ly = BY + (BH / 9) * (i + 1)
          return (
            <line
              key={i}
              x1={BX} x2={BX + BW}
              y1={ly} y2={ly}
              stroke={ly < builtY ? "#e5e7eb" : "rgba(255,255,255,0.18)"}
              strokeWidth="0.7"
            />
          )
        })}

        {/* ── Windows (2 cols × 5 rows) ─────────────── */}
        {[0, 1, 2, 3, 4].flatMap((row) =>
          [20, 40].map((wx) => {
            const wy = BY + 8 + row * 22
            const isBuiltWin = builtH > 0 && wy + 7 >= builtY
            return (
              <rect
                key={`${row}-${wx}`}
                x={wx} y={wy} width={10} height={7}
                rx="1.5"
                fill={isBuiltWin ? "rgba(255,255,255,0.28)" : "#f0f0f0"}
                stroke={isBuiltWin ? "rgba(255,255,255,0.1)" : "#e5e7eb"}
                strokeWidth="0.5"
              />
            )
          })
        )}

        {/* ── Ground ────────────────────────────────── */}
        <rect x="4" y={BY + BH + 3} width="72" height="5" rx="2.5" fill="#e5e7eb" />
        <rect x="0" y={BY + BH + 8} width="80" height="3" rx="1.5" fill="#d1d5db" />
      </svg>

      {/* Floor counter */}
      <p className="text-sm font-bold tabular-nums" style={{ color: fillColor }}>
        {clamped}
        <span className="text-xs font-normal text-gray-400"> / {totalFloors}F</span>
      </p>
    </div>
  )
}
