'use client'

import { cn } from '@/lib/utils'
import type { SessionMode } from '@/types/session'

const SESSION_MODE_LABELS: Record<SessionMode, string> = {
  INTERVIEW: '면접',
  PRESENTATION: '발표',
}

interface ModeSegmentProps {
  mode: SessionMode
  onChange: (mode: SessionMode) => void
  className?: string
}

export function ModeSegment({ mode, onChange, className }: ModeSegmentProps) {
  return (
    <div
      className={cn(
        'mt-4 grid grid-cols-2 gap-1 rounded-[18px] border border-white/70 bg-white/70 p-[5px]',
        className
      )}
    >
      {(Object.keys(SESSION_MODE_LABELS) as SessionMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={cn(
            'rounded-[15px] py-2.5 text-sm font-black transition-all',
            mode === m
              ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg'
              : 'bg-transparent text-slate-400'
          )}
        >
          {SESSION_MODE_LABELS[m]}
        </button>
      ))}
    </div>
  )
}
