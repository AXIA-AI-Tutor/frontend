'use client'

import { useEffect, useState } from 'react'

interface AILoadingOverlayProps {
  messages: string[]
  intervalMs?: number
}

export function AILoadingOverlay({
  messages,
  intervalMs = 3500,
}: AILoadingOverlayProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [messages.length, intervalMs])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <span className="absolute inset-0 animate-ping rounded-full bg-blue-100" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
            🎙️
          </span>
        </div>
        <p className="min-h-[2.5rem] text-sm font-black leading-snug text-slate-700 transition-all">
          {messages[index]}
        </p>
        <div className="mt-4 flex justify-center gap-1.5">
          {messages.map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-4 bg-blue-600' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
