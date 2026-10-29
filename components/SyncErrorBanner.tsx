"use client"

import { useState } from "react"

type Props = {
  message: string
  onResync: () => Promise<void>
  className?: string
}

export default function SyncErrorBanner({ message, onResync, className = "" }: Props) {
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (busy) return
    setBusy(true)
    try {
      await onResync()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      role="alert"
      className={`flex flex-col gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs text-red-600 ${className}`}
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="w-fit rounded-full border border-red-200 bg-white px-3 py-1 font-medium text-red-600 disabled:opacity-50"
      >
        {busy ? "同期中…" : "再同期"}
      </button>
    </div>
  )
}
