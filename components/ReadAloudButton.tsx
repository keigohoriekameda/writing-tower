"use client"

import { useEffect, useState } from "react"

export default function ReadAloudButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  const handleClick = () => {
    const synth = window.speechSynthesis
    if (!synth) return

    if (isSpeaking) {
      synth.cancel()
      setIsSpeaking(false)
      return
    }

    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    synth.speak(utterance)
    setIsSpeaking(true)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-3 flex h-10 items-center justify-center gap-1.5 rounded-full bg-indigo-50 px-4 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
    >
      {isSpeaking ? "⏹ Stop" : "🔊 Read Aloud"}
    </button>
  )
}
