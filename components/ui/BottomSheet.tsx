'use client'

import { cn } from '@/lib/utils'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-20 flex items-end',
        open ? 'flex' : 'hidden'
      )}
      style={{ background: 'rgba(15,23,42,.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full rounded-t-3xl bg-white px-4 pb-6 pt-4 shadow-2xl">
        {/* 드래그 핸들 */}
        <div className="mx-auto mb-3 h-[5px] w-11 rounded-full bg-slate-200" />
        {children}
      </div>
    </div>
  )
}