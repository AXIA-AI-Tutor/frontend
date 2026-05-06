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
import { cn } from '@/lib/utils'
import type { Screen } from '@/types'
import type { FeedbackData, TurnData } from '@/types/feedback'

interface FeedbackNavigationOptions {
  turnNumber?: number
}

interface FeedbackScreenProps {
  turnNumber: number
  turn: TurnData
  feedback: FeedbackData
  onNavigate: (screen: Screen, options?: FeedbackNavigationOptions) => void
  onToast: (msg: string) => void
}

export function FeedbackScreen({
  turnNumber,
  turn,
  feedback,
  onNavigate,
  onToast,
}: FeedbackScreenProps) {
  const [saved, setSaved] = useState(false)

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
                {feedback.durationLabel ?? '00:00'}
              </span>
            </div>
            <p className="mt-3 break-keep text-lg font-black leading-snug text-slate-950">
              {turn.question}
            </p>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              <b className="mb-1 block text-xs font-black text-slate-950">
                내 답변
              </b>
              {feedback.answer}
            </div>
          </section>

          <section className="mt-4 grid gap-3">
            <FeedbackBlock title="한 줄 요약">{feedback.summary}</FeedbackBlock>

            <FeedbackBlock title="근거">
              <ul className="list-disc pl-4">
                {feedback.rationale.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </FeedbackBlock>

            <FeedbackBlock title="개선 예시" example>
              &ldquo;{feedback.improvedExample}&rdquo;
            </FeedbackBlock>

            <FeedbackBlock title="세부 점수 (5점 만점)">
              <ScoreRow scores={feedback.scores} />
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
