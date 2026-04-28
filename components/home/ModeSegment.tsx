'use client'

import { cn } from '@/lib/utils'
import type { Mode } from '@/types'

interface ModeSegmentProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeSegment({ mode, onChange }: ModeSegmentProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-1 rounded-[18px] border border-white/70 bg-white/70 p-[5px]">
      {(['면접', '발표'] as Mode[]).map((m) => (
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
          {m}
        </button>
      ))}
    </div>
  )
}