'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
  on: boolean
  onChange: () => void
  ariaLabel?: string
}

export function Toggle({ on, onChange, ariaLabel }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      aria-label={ariaLabel}
      className={cn(
        'relative h-7 w-12 rounded-full border-0 transition-all duration-200',
        on
          ? 'bg-gradient-to-br from-blue-600 to-purple-700'
          : 'bg-slate-300'
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-md transition-all duration-200',
          on ? 'left-[23px]' : 'left-[3px]'
        )}
      />
    </button>
  )
}