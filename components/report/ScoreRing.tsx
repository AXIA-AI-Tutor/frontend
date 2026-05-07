'use client'

import type { CSSProperties } from 'react'

interface ScoreRingProps {
  score: number
  max?: number
}

export function ScoreRing({ score, max = 100 }: ScoreRingProps) {
  const pct = (score / max) * 100

  return (
    <div
      className="relative grid h-24 w-24 place-items-center rounded-full bg-[conic-gradient(#2563eb_0_var(--score-pct),#e3e9fb_var(--score-pct))]"
      style={{ '--score-pct': `${pct}%` } as CSSProperties}
    >
      {/* 안쪽 흰 원 */}
      <div className="absolute inset-2.5 rounded-full bg-white" />
      <div className="relative z-10 text-center">
        <strong className="block text-[28px] leading-none">{score}</strong>
        <small className="text-[10px] text-slate-500">/{max}</small>
      </div>
    </div>
  )
}
