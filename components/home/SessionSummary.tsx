'use client'

import type { Screen } from '@/types'

interface SessionSummaryProps {
  onNavigate: (screen: Screen) => void
}

export function SessionSummary({ onNavigate }: SessionSummaryProps) {
  return (
    <>
      <div
        className="flex items-center justify-between"
        style={{ fontSize: 15 }}
      >
        <h3 className="font-bold">지난 세션 요약</h3>
        <button
          onClick={() => onNavigate('report')}
          className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-black text-slate-700"
        >
          자세히 보기 ›
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
