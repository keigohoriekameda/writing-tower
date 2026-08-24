"use client"

import { useEffect, useState } from "react"

const RATES = [
  { value: 0.7, label: "ゆっくり" },
  { value: 0.8, label: "ふつう" },
  { value: 0.9, label: "入試速度" },
] as const

const DEFAULT_RATE = 0.8

export default function ReadAloudButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [rate, setRate] = useState<number>(DEFAULT_RATE)

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  const stop = () => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }

  const handleRateChange = (value: number) => {
    if (isSpeaking) stop()
    setRate(value)
  }

  const handleClick = () => {
    const synth = window.speechSynthesis
    if (!synth) return

    if (isSpeaking) {
      stop()
      return
    }

    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = rate
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    synth.speak(utterance)
    setIsSpeaking(true)
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="読み上げ速度">
        {RATES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => handleRateChange(r.value)}
            aria-pressed={rate === r.value}
            className={`h-11 min-w-[4.5rem] rounded-full px-3 text-xs font-semibold transition-colors ${
              rate === r.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-indigo-50 px-4 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
      >
        {isSpeaking ? "⏹ Stop" : "🔊 Read Aloud"}
      </button>
    </div>
  )
}
