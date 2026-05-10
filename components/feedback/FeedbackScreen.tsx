'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react'

import { FeedbackBlock } from '@/components/feedback/FeedbackBlock'
import { ScoreRow } from '@/components/feedback/ScoreRow'
import { BottomNav } from '@/components/layout/BottomNav'
import { getAnswerDurationLabel } from '@/lib/feedback/duration'
import { getApiErrorMessage } from '@/lib/api/client'
import { getAnswer, getAnswerFeedbacks } from '@/lib/api/answers'
import { nextQuestion } from '@/lib/api/sessions'
import {
  isPracticeSessionActive,
  usePracticeSessionStore,
} from '@/lib/stores/practiceSession'
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
  sessionId?: number
}

interface FeedbackScreenProps {
  turnNumber: number
  sessionId?: number
  answerId?: number
  turn: TurnData
  feedback: FeedbackData
  feedbackSource?: FeedbackSource
  answerStatus?: SttStatus
  onNavigate: (screen: Screen, options?: FeedbackNavigationOptions) => void
  onToast: (msg: string) => void
}

export function FeedbackScreen({
  turnNumber,
  sessionId,
  answerId,
  turn,
  feedback,
  feedbackSource = 'live',
  answerStatus = 'COMPLETED',
  onNavigate,
  onToast,
}: FeedbackScreenProps) {
  const hasActiveSession = usePracticeSessionStore((state) =>
    isPracticeSessionActive(state.sessionStart)
  )
  const questionByTurn = usePracticeSessionStore(
    (state) => state.questionByTurn
  )
  const maxQuestionCount = usePracticeSessionStore(
    (state) => state.maxQuestionCount
  )
  const setTurnQuestion = usePracticeSessionStore(
    (state) => state.setTurnQuestion
  )
  const router = useRouter()
  const isReportSource = feedbackSource === 'report'
  // 이미 준비된 다음 질문이 있으면 재호출 없이 바로 이동한다.
  const nextTurnNumber = !isReportSource
    ? (Object.keys(questionByTurn)
        .map(Number)
        .filter((n) => n > turnNumber)
        .sort((a, b) => a - b)[0] ?? null)
    : null
  const shouldFetchFromApi = isReportSource && !!answerId

  const [fetchState, setFetchState] = useState<
    'idle' | 'loading' | 'done' | 'error'
  >(shouldFetchFromApi ? 'loading' : 'idle')
  const [apiTurn, setApiTurn] = useState<TurnData | null>(null)
  const [apiFeedback, setApiFeedback] = useState<FeedbackData | null>(null)
  const [apiAnswerStatus, setApiAnswerStatus] = useState<SttStatus | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isLoadingNextQuestion, setIsLoadingNextQuestion] = useState(false)

  useEffect(() => {
    if (!shouldFetchFromApi) return

    let cancelled = false

    async function fetchFeedback() {
      setFetchState('loading')

      try {
        const [answerData, feedbacks] = await Promise.all([
          getAnswer(answerId!),
          getAnswerFeedbacks(answerId!),
        ])

        if (cancelled) return

        const latestFeedback = feedbacks[feedbacks.length - 1] ?? null

        const q = answerData.questionText
        setApiTurn({
          question: q,
          hint: '',
          topic: q.length > 16 ? q.slice(0, 16) + '…' : q,
        })

        setApiFeedback(
          latestFeedback
            ? {
                feedbackId: latestFeedback.feedbackId,
                answerId: latestFeedback.answerId,
                createdAt: latestFeedback.createdAt,
                answer: answerData.transcript,
                summary: latestFeedback.summary,
                evidence: latestFeedback.evidence,
                improvedExample: latestFeedback.improvementExample,
                scores: [
                  { label: '논리성', score: latestFeedback.structureScore },
                  { label: '구체성', score: latestFeedback.specificityScore },
                  { label: '관련성', score: latestFeedback.relevanceScore },
                  { label: '전달력', score: latestFeedback.deliveryScore },
                ],
                durationLabel: getAnswerDurationLabel(answerData),
              }
            : {
                answer: answerData.transcript,
                summary: null,
                evidence: null,
                improvedExample: null,
                scores: [],
                durationLabel: getAnswerDurationLabel(answerData),
              }
        )

        setApiAnswerStatus(answerData.sttStatus)
        setFetchState('done')
      } catch (error) {
        if (cancelled) return
        const message = getApiErrorMessage(
          error,
          '피드백 데이터를 불러오지 못했습니다.'
        )
        setFetchError(message)
        setFetchState('error')
      }
    }

    void fetchFeedback()
    return () => {
      cancelled = true
    }
  }, [answerId, shouldFetchFromApi])

  const handleBack = () => {
    if (isReportSource) {
      if (window.history.length > 1) {
        router.back()
        return
      }
      router.push('/report/list')
      return
    }
    if (nextTurnNumber !== null) {
      onNavigate('live', { turnNumber: nextTurnNumber, sessionId })
    } else {
      onNavigate('live', { sessionId })
    }
  }

  const canMoveToNextQuestion =
    !isReportSource &&
    !!sessionId &&
    (maxQuestionCount === 0 || turnNumber < maxQuestionCount)

  const handleNextQuestion = async () => {
    if (!canMoveToNextQuestion || isLoadingNextQuestion) {
      return
    }

    if (nextTurnNumber !== null) {
      onNavigate('live', { turnNumber: nextTurnNumber, sessionId })
      return
    }

    setIsLoadingNextQuestion(true)

    try {
      const res = await nextQuestion(sessionId)

      if (
        res.questionIndex <= turnNumber ||
        res.questionIndex > res.maxQuestionCount
      ) {
        onToast('다음 질문 정보를 확인하지 못했습니다.')
        return
      }

      setTurnQuestion(res.questionIndex, res.question, res.maxQuestionCount)
      onNavigate('live', { turnNumber: res.questionIndex, sessionId })
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        '다음 질문을 불러오지 못했습니다.'
      )
      onToast(message)
    } finally {
      setIsLoadingNextQuestion(false)
    }
  }

  const displayTurn = fetchState === 'done' && apiTurn ? apiTurn : turn
  const displayFeedback =
    fetchState === 'done' && apiFeedback ? apiFeedback : feedback
  const displayAnswerStatus =
    fetchState === 'done' && apiAnswerStatus ? apiAnswerStatus : answerStatus

  const answerText = displayFeedback.answer || '답변 전사 결과가 없습니다.'
  const summary = displayFeedback.summary || '생성된 피드백 요약이 없습니다.'
  const evidence = displayFeedback.evidence || '생성된 근거가 없습니다.'
  const improvementExample =
    displayFeedback.improvedExample || '생성된 개선 예시가 없습니다.'

  if (fetchState === 'loading') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#f8faff] lg:static lg:min-h-[calc(100vh-132px)] lg:rounded-lg lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={28} />
          <p className="text-sm">피드백을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (fetchState === 'error') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#f8faff] lg:static lg:min-h-[calc(100vh-132px)] lg:rounded-lg lg:border lg:border-slate-200 lg:bg-white lg:shadow-sm">
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm text-slate-500">
            {fetchError ?? '피드백 데이터를 불러오지 못했습니다.'}
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="absolute inset-0 overflow-auto bg-[#f8faff] px-4 pb-23 pt-5 text-slate-950 lg:static lg:min-h-[calc(100vh-132px)] lg:rounded-lg lg:border lg:border-slate-200 lg:bg-white lg:p-6 lg:shadow-sm">
        <div className="mx-auto max-w-5xl">
          <header className="flex items-center justify-between gap-3">
            {canMoveToNextQuestion ? (
              <button
                type="button"
                onClick={() => void handleNextQuestion()}
                disabled={isLoadingNextQuestion}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-600 px-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-blue-700"
                aria-label="다음 질문으로 이동"
              >
                다음 질문으로
                {isLoadingNextQuestion ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  <ArrowRight size={15} />
                )}
              </button>
            ) : (
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
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-blue-600">
                질문 {turnNumber} 피드백
              </p>
              <h2 className="truncate text-xl font-black tracking-tight text-slate-950">
                {displayTurn.topic} 답변 분석
              </h2>
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-black ${ANSWER_STATUS_STYLE[displayAnswerStatus]}`}
            >
              {ANSWER_STATUS_ICON[displayAnswerStatus]}
              {ANSWER_STATUS_LABEL[displayAnswerStatus]}
            </span>
          </header>

          <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:bg-slate-50 lg:shadow-none">
            <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-500">
              <span>
                Q{turnNumber}. {displayTurn.topic}
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">
                {displayFeedback.durationLabel ?? '--:--'}
              </span>
            </div>
            <p className="mt-3 break-keep text-lg font-black leading-snug text-slate-950">
              {displayTurn.question}
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
              <ScoreRow scores={displayFeedback.scores} />
            </FeedbackBlock>
          </section>
        </div>
      </div>

      <BottomNav
        current={isReportSource ? 'report' : 'live'}
        onNavigate={onNavigate}
        disabledScreens={hasActiveSession ? [] : ['live']}
      />
    </>
  )
}
