'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { icon: '📄', label: '이력서' },
  { icon: '✎', label: '자소서' },
  { icon: '💼', label: '포트폴리오' },
  { icon: '📋', label: 'JD' },
] as const

interface UploadGridProps {
  onUpload?: (label: string) => void
}

export function UploadGrid({ onUpload }: UploadGridProps) {
  const [uploaded, setUploaded] = useState<Set<string>>(new Set())

  const handleClick = (label: string) => {
    setUploaded((prev) => new Set([...prev, label]))
    onUpload?.(label)
  }

  return (
    <div className="grid grid-cols-4 gap-[7px]">
      {ITEMS.map(({ icon, label }) => {
        const done = uploaded.has(label)
        return (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className={cn(
              'relative min-h-[88px] rounded-[14px] border bg-white px-1 py-[11px] text-center transition-all duration-200',
              done
                ? '-translate-y-0.5 border-indigo-300 shadow-md'
                : 'border-slate-200'
            )}
          >
            {/* 완료 체크 */}
            {done && (
              <span className="absolute right-[7px] top-[7px] grid h-[18px] w-[18px] place-items-center rounded-full bg-emerald-500 text-[12px] font-black text-white">
                ✓
              </span>
            )}
            <div className="mx-auto mb-2 grid h-[31px] w-[31px] place-items-center rounded-[10px] bg-gradient-to-br from-blue-100 to-blue-50 text-[17px] text-indigo-600">
              {icon}
            </div>
            <b className="block text-[13px]">{label}</b>
            <span
              className={cn(
                'text-[11px]',
                done ? 'font-black text-emerald-500' : 'text-slate-400'
              )}
            >
              {done ? '완료' : '업로드 ⇧'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
