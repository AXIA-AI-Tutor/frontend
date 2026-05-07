'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock } from 'lucide-react'

import { FeedbackBlock } from '@/components/feedback/FeedbackBlock'
import { ScoreRow } from '@/components/feedback/ScoreRow'
import { BottomNav } from '@/components/layout/BottomNav'
import type { Screen } from '@/types'
import type { SttStatus } from '@/types/answer'
import type { FeedbackData, FeedbackSource, TurnData } from '@/types/feedback'

const ANSWER_STATUS_LABEL: Record<SttStatus, string> = {
  PENDING: '분석 대기',
  COMPLETED: '분석 완료',
  FAILED: '분석 실패',
}

const ANSWER_STATUS_STYLE: Record<SttStatus, string> = {
  PENDING: 'bg-slate-100 text-slate-500',
  COMPLETED: 'bg-emerald-50 text-emerald-600',
  FAILED: 'bg-red-50 text-red-600',
}

const ANSWER_STATUS_ICON: Record<SttStatus, React.ReactNode> = {
  PENDING: <Clock size={14} />,
  COMPLETED: <CheckCircle2 size={14} />,
  FAILED: <AlertCircle size={14} />,
}

interface FeedbackNavigationOptions {
  turnNumber?: number
}

interface FeedbackScreenProps {
  turnNumber: number
  turn: TurnData
  feedback: FeedbackData
  feedbackSource?: FeedbackSource
  answerStatus?: SttStatus
  onNavigate: (screen: Screen, options?: FeedbackNavigationOptions) => void
}

export function FeedbackScreen({
  turnNumber,
  turn,
  feedback,
  feedbackSource = 'live',
  answerStatus = 'COMPLETED',
  onNavigate,
}: FeedbackScreenProps) {
  const router = useRouter()
  const isReportSource = feedbackSource === 'report'
  const answerText = feedback.answer || '답변 전사 결과가 없습니다.'
  const summary = feedback.summary || '생성된 피드백 요약이 없습니다.'
  const evidence = feedback.evidence || '생성된 근거가 없습니다.'
  const improvementExample =
    feedback.improvedExample || '생성된 개선 예시가 없습니다.'

  const handleBack = () => {
    if (isReportSource) {
      if (window.history.length > 1) {
        router.back()
        return
      }

      router.push('/report/list')
      return
    }

    onNavigate('live')
  }

  return (
    <>
      <div className="absolute inset-0 overflow-auto bg-[#f8faff] px-4 pb-[92px] pt-5 text-slate-950 lg:static lg:min-h-[calc(100vh-132px)] lg:rounded-lg lg:border lg:border-slate-200 lg:bg-white lg:p-6 lg:shadow-sm">
        <div className="mx-auto max-w-5xl">
          <header className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              aria-label={
                isReportSource
                  ? '이전 리포트 화면으로 돌아가기'
                  : '실시간 연습으로 돌아가기'
              }
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
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-black ${ANSWER_STATUS_STYLE[answerStatus]}`}
            >
              {ANSWER_STATUS_ICON[answerStatus]}
              {ANSWER_STATUS_LABEL[answerStatus]}
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
              {answerText}
            </div>
          </section>

          <section className="mt-4 grid gap-3">
            <FeedbackBlock title="한 줄 요약">{summary}</FeedbackBlock>

            <FeedbackBlock title="근거">
              <p className="whitespace-pre-line">{evidence}</p>
            </FeedbackBlock>

            <FeedbackBlock title="개선 예시" example>
              &ldquo;{improvementExample}&rdquo;
            </FeedbackBlock>

            <FeedbackBlock title="세부 점수 (100점 기준)">
              <ScoreRow scores={feedback.scores} />
            </FeedbackBlock>
          </section>
        </div>
      </div>

      <BottomNav
        current={isReportSource ? 'report' : 'live'}
        onNavigate={onNavigate}
      />
    </>
  )
}
