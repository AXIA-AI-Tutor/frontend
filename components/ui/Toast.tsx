'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  show: boolean
  onHide: () => void
}

export function Toast({ message, show, onHide }: ToastProps) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onHide, 1800)
      return () => clearTimeout(t)
    }
  }, [show, onHide])

  return (
    <div
      className={cn(
        'fixed left-1/2 bottom-7 z-[100] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-xl transition-all duration-250',
        show
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-5 pointer-events-none'
      )}
    >
      {message}
    </div>
  )
}
