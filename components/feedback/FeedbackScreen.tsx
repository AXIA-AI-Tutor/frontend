'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  RotateCcw,
  SkipForward,
} from 'lucide-react'

import { FeedbackBlock } from '@/components/feedback/FeedbackBlock'
import { ScoreRow } from '@/components/feedback/ScoreRow'
import { BottomNav } from '@/components/layout/BottomNav'
import { getLiveTurn } from '@/components/live/liveTurns'
import { cn } from '@/lib/utils'
import type { Screen } from '@/types'

interface FeedbackNavigationOptions {
  turnNumber?: number
}

interface FeedbackScreenProps {
  turnNumber: number
  onNavigate: (screen: Screen, options?: FeedbackNavigationOptions) => void
  onToast: (msg: string) => void
}

const SCORES = [
  { label: '구조', score: 4.0 },
  { label: '구체성', score: 3.0 },
  { label: '관련성', score: 4.0 },
  { label: '전달력', score: 3.5 },
]

const MOCK_ANSWERS = [
  '저는 사용자 문제를 구조적으로 파악하고 제품 경험으로 해결하는 데 강점이 있습니다. 이전 프로젝트에서 고객 문의 흐름을 분석해 반복 질문을 줄였고, 이런 경험을 바탕으로 서비스 개선에 기여하고 싶습니다.',
  '최근 프로젝트에서는 사용자 리서치와 화면 설계 파트를 맡았습니다. 요구사항을 정리하고 우선순위를 조율해 핵심 기능을 먼저 출시했고, 이후 피드백을 반영해 사용성을 개선했습니다.',
  '평소 IT 기술을 활용해 사람들의 생활을 편리하게 만드는 일에 관심이 많았습니다. 귀사의 데이터 플랫폼은 다양한 산업에서 가치 있는 서비스를 제공하고 있어 이 곳에서 제 역량을 발휘하고 싶어 지원했습니다.',
]

export function FeedbackScreen({
  turnNumber,
  onNavigate,
  onToast,
}: FeedbackScreenProps) {
  const [saved, setSaved] = useState(false)
  const turn = getLiveTurn(turnNumber)
  const answer = MOCK_ANSWERS[(turnNumber - 1) % MOCK_ANSWERS.length]

  const handleSave = () => {
    setSaved((value) => !value)
    onToast('피드백이 개인 메모리에 저장되었습니다.')
  }

  const handleNextTurn = () => {
    onNavigate('live', { turnNumber: turnNumber + 1 })
  }

  const handleRetryTurn = () => {
    onNavigate('live', { turnNumber })
  }

  return (
    <>
      <div className="absolute inset-0 overflow-auto bg-[#f8faff] px-4 pb-[92px] pt-5 text-slate-950 lg:static lg:min-h-[calc(100vh-132px)] lg:rounded-lg lg:border lg:border-slate-200 lg:bg-white lg:p-6 lg:shadow-sm">
        <div className="mx-auto max-w-5xl">
          <header className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRetryTurn}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              aria-label="실시간 연습으로 돌아가기"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-blue-600">
                턴 {turnNumber} 피드백
              </p>
              <h2 className="truncate text-xl font-black tracking-tight text-slate-950">
                {turn.topic} 답변 분석
              </h2>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-black text-emerald-600">
              <CheckCircle2 size={14} />
              완료
            </span>
          </header>

          <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:bg-slate-50 lg:shadow-none">
            <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-500">
              <span>
                Q{turnNumber}. {turn.topic}
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">
                00:42
              </span>
            </div>
            <p className="mt-3 break-keep text-lg font-black leading-snug text-slate-950">
              {turn.question}
            </p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              <b className="mb-1 block text-xs font-black text-slate-950">
                내 답변
              </b>
              {answer}
            </div>
          </section>

          <section className="mt-4 grid gap-3">
            <FeedbackBlock title="한 줄 요약">
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
              공감했습니다. 학부 프로젝트에서 사용자 행동 데이터를 분석해
              전환율을 <b className="text-blue-600">18%</b> 개선한 경험을
              바탕으로 기여하고 싶습니다.&rdquo;
            </FeedbackBlock>

            <FeedbackBlock title="세부 점수 (5점 만점)">
              <ScoreRow scores={SCORES} />
            </FeedbackBlock>
          </section>

          <div className="mt-4 grid grid-cols-[1fr_.9fr_1.1fr] gap-2">
            <button
              type="button"
              onClick={handleRetryTurn}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              다시 답변
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                'inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border text-sm font-black shadow-sm transition-colors',
                saved
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              )}
            >
              <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
              {saved ? '저장됨' : '저장'}
            </button>
            <button
              type="button"
              onClick={handleNextTurn}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border border-blue-500 bg-blue-600 text-sm font-black text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              다음 질문
              <SkipForward size={16} />
            </button>
          </div>
        </div>
      </div>

      <BottomNav current="live" onNavigate={onNavigate} />
    </>
  )
}
