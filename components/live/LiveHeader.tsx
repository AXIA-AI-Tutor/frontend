'use client'

import { ChevronLeft } from 'lucide-react'

import type { Screen } from '@/types'

interface LiveHeaderProps {
  onNavigate: (screen: Screen) => void
}

export function LiveHeader({ onNavigate }: LiveHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:h-16 lg:rounded-lg lg:border lg:px-5">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        aria-label="홈으로 돌아가기"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      <div className="text-center">
        <h2 className="text-base font-black text-slate-950 lg:text-lg">
          실시간 연습
        </h2>
        <p className="hidden text-xs font-bold text-slate-400 lg:block">
          답변 흐름과 자세를 함께 점검합니다.
        </p>
      </div>

      <div className="h-9 w-9" aria-hidden />
    </header>
  )
}
