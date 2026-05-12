'use client'

import { useEffect, useState } from 'react'

interface AILoadingOverlayProps {
  messages: string[]
  intervalMs?: number
}

const DOT_COUNT = 5
const DOT_INTERVAL_MS = 240

export function AILoadingOverlay({
  messages,
  intervalMs = 3500,
}: AILoadingOverlayProps) {
  const [index, setIndex] = useState(0)
  const [activeDot, setActiveDot] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [messages.length, intervalMs])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % DOT_COUNT)
    }, DOT_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="relative mx-auto mb-6 h-16 w-16">
          <span className="absolute inset-0 animate-ping rounded-full bg-blue-100" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
            🎙️
          </span>
        </div>
        <p className="min-h-10 text-sm font-black leading-snug text-slate-700">
          {messages[index]}
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <span
              key={i}
              className="block h-2 w-2 rounded-full"
              style={{
                backgroundColor: activeDot === i ? '#3b82f6' : '#cbd5e1',
                transform:
                  activeDot === i ? 'translateY(-6px)' : 'translateY(0)',
                transition:
                  'transform 200ms ease-in-out, background-color 200ms ease-in-out',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
