'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FeedbackBlock } from './FeedbackBlock'
import { ScoreRow } from './ScoreRow'
import type { Screen } from '@/types'

interface FeedbackSheetProps {
  onNavigate: (screen: Screen) => void
  onSave?: () => void
}

const SCORES = [
  { label: '구조', score: 4.0 },
  { label: '구체성', score: 3.0 },
  { label: '관련성', score: 4.0 },
  { label: '전달력', score: 3.5 },
]

export function FeedbackSheet({ onNavigate, onSave }: FeedbackSheetProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved((v) => !v)
    onSave?.()
  }

  return (
    <div
      className="absolute bottom-2 left-2.5 right-2.5 max-h-[625px] overflow-auto rounded-[24px_24px_31px_31px] bg-white px-[13px] pb-[82px] pt-4 text-slate-800"
      style={{ boxShadow: '0 -18px 40px rgba(0,0,0,.26)' }}
    >
      {/* 드래그 핸들 */}
      <div className="mx-auto mb-2.5 h-[5px] w-11 rounded-full bg-slate-200" />

      {/* 닫기 */}
      <button
        onClick={() => onNavigate('live')}
        className="absolute right-3 top-3.5 grid h-[30px] w-[30px] place-items-center rounded-full border border-slate-200 bg-white font-black text-slate-500"
      >
        ×
      </button>

      {/* 아바타 */}
      <div className="mx-auto mb-2.5 grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-gradient-to-b from-white to-blue-50">
        <span className="text-2xl">🧑‍💼</span>
      </div>

      <FeedbackBlock title="✓ 한 줄 요약">
        회사·직무와의 연결은 좋지만, 구체적 경험과 기여 포인트가 더해지면
        설득력이 크게 높아집니다.
      </FeedbackBlock>

      <FeedbackBlock title="근거">
        <ul className="list-disc pl-4">
          <li>회사의 서비스/가치에 대한 이해가 드러나요.</li>
          <li>본인의 경험이 추상적이어서 차별성이 약해요.</li>
          <li>입사 후 기여 포인트가 명확하지 않아요.</li>
        </ul>
      </FeedbackBlock>

      <FeedbackBlock title="개선 예시" example>
        &ldquo;데이터 기반 의사결정으로 고객 경험을 혁신하는 귀사의 방향에
        공감했습니다. 학부 프로젝트에서 사용자 행동 데이터를 분석해 전환율을{' '}
        <b className="text-blue-600">18%</b> 개선한 경험을 바탕으로 기여하고
        싶습니다.&rdquo;
      </FeedbackBlock>

      <FeedbackBlock title="세부 점수 (5점 만점)">
        <ScoreRow scores={SCORES} />
      </FeedbackBlock>

      {/* 하단 버튼 */}
      <div className="absolute bottom-[18px] left-[13px] right-[13px] grid grid-cols-[1fr_.85fr_1.15fr] gap-2">
        <button
          onClick={() => onNavigate('live')}
          className="rounded-[14px] border border-slate-200 bg-white py-3 font-black text-slate-700"
        >
          ↻ 다시 답변
        </button>
        <button
          onClick={handleSave}
          className={cn(
            'rounded-[14px] border py-3 font-black transition-all',
            saved
              ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
              : 'border-slate-200 bg-white text-slate-700'
          )}
        >
          {saved ? '✓ 저장됨' : '▱ 저장'}
        </button>
        <button
          onClick={() => onNavigate('live')}
          className="rounded-[14px] border-0 bg-gradient-to-r from-blue-600 to-purple-700 py-3 font-black text-white"
        >
          다음 질문 →
        </button>
      </div>
    </div>
  )
}
