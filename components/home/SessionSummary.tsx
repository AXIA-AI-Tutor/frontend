'use client'

import type { Screen } from '@/types'
import { Archive, ChevronRight } from 'lucide-react'

interface SessionSummaryProps {
  onNavigate: (screen: Screen) => void
}

export function SessionSummary({ onNavigate }: SessionSummaryProps) {
  return (
    <>
      <div className="flex items-center justify-between text-[15px]">
        <div className="flex items-center gap-2">
          <Archive className="text-blue-600" size={20} />
          <h3 className="text-base font-black text-slate-950">
            지난 세션 요약
          </h3>
        </div>
        <button
          onClick={() => onNavigate('report')}
          className="flex px-2 text-xs font-black text-slate-700"
        >
          자세히 보기 <ChevronRight size={14} />
        </button>
      </div>
      <div className="mt-[9px] grid grid-cols-3 border-t border-slate-100 pt-2.5 text-center">
        <div>
          <b className="block text-[13px]">평균 점수</b>
          <span className="text-[12px] font-black text-blue-600">78점</span>
          <small className="block text-[11px] text-slate-400">(최근 5회)</small>
        </div>
        <div>
          <b className="block text-[13px]">강점</b>
          <span className="text-[12px] font-black text-emerald-500">
            논리적 구조 ↑
          </span>
        </div>
        <div>
          <b className="block text-[13px]">개선 포인트</b>
          <span className="text-[12px] font-black text-orange-500">
            답변 길이 ↑
          </span>
        </div>
      </div>
    </>
  )
}
