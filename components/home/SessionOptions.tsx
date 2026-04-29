'use client'

import { Dropdown } from '@/components/ui/Dropdown'

interface SessionOptionsProps {
  onSelect?: (key: string, value: string) => void
}

export function SessionOptions({ onSelect }: SessionOptionsProps) {
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-100">
      <div className="px-3 py-3">
        <small className="mb-[7px] flex items-center gap-1 text-[11px] font-black text-slate-700">
          ▮ 난이도
        </small>
        <Dropdown
          label="보통"
          options={['쉬움', '보통', '어려움']}
          onSelect={(v) => onSelect?.('difficulty', v)}
        />
      </div>
      <div className="px-3 py-3">
        <small className="mb-[7px] flex items-center gap-1 text-[11px] font-black text-slate-700">
          ◷ 시간
        </small>
        <Dropdown
          label="20분"
          options={['10분', '20분', '30분']}
          onSelect={(v) => onSelect?.('time', v)}
        />
      </div>
      <div className="px-3 py-3">
        <small className="mb-[7px] flex items-center gap-1 text-[11px] font-black text-slate-700">
          ◎ 연습 목적
        </small>
        <Dropdown
          label="실전 대비"
          options={['실전 대비', '면접 합격', '발표 리허설']}
          onSelect={(v) => onSelect?.('purpose', v)}
        />
      </div>
    </div>
  )
}
