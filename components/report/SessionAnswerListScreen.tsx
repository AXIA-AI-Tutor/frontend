'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

import { BottomNav } from '@/components/layout/BottomNav'
import { getApiErrorMessage } from '@/lib/api/client'
import { getSessionAnswers } from '@/lib/api/answers'
import { getSessionReport } from '@/lib/api/reports'
import { getSession } from '@/lib/api/sessions'
import {
  isPracticeSessionActive,
  usePracticeSessionStore,
} from '@/lib/stores/practiceSession'
import type { AnswerResponse } from '@/types/answer'
import type { ReportAvailabilityStatus, ReportResponse } from '@/types/report'
import type { Screen } from '@/types'
import type { SessionMode, SessionResponse } from '@/types/session'

interface SessionAnswerListScreenProps {
  sessionId: number
}

const MODE_LABEL: Record<SessionMode, string> = {
  INTERVIEW: '면접',
  PRESENTATION: '발표',
}

const SCREEN_PATHS: Record<Screen, string> = {
  home: '/',
  live: '/live',
  feedback: '/feedback',
  report: '/report',
  reportList: '/report/list',
}

const REPORT_STATUS_LABEL: Record<ReportAvailabilityStatus, string> = {
  READY: '집계 완료',
  MISSING: '리포트 없음',
  GENERATING: '집계 중',
  FAILED: '생성 실패',
}

const STT_STATUS_LABEL: Record<AnswerResponse['sttStatus'], string> = {
  PENDING: '분석 대기',
  COMPLETED: '분석 완료',
  FAILED: '분석 실패',
}

const STT_STATUS_COLOR: Record<AnswerResponse['sttStatus'], string> = {
  PENDING: 'bg-slate-100 text-slate-500',
  COMPLETED: 'bg-emerald-50 text-emerald-600',
  FAILED: 'bg-red-50 text-red-600',
}

function formatDuration(sec: number | null) {
  if (sec == null) return null
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}

function formatMetric(value: number | null) {
  return value == null ? null : Math.round(value)
}

export function SessionAnswerListScreen({
  sessionId,
}: SessionAnswerListScreenProps) {
  const hasActiveSession = usePracticeSessionStore((state) =>
    isPracticeSessionActive(state.sessionStart)
  )
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [answers, setAnswers] = useState<AnswerResponse[]>([])
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setIsLoading(true)
      setFetchError(null)

      try {
        const [sessionData, answersData, reportData] = await Promise.all([
          getSession(sessionId),
          getSessionAnswers(sessionId),
          getSessionReport(sessionId).catch(() => null),
        ])
        if (!cancelled) {
          setSession(sessionData)
          setAnswers(answersData)
          setReport(reportData)
        }
      } catch (error) {
        if (!cancelled) {
          const message = getApiErrorMessage(
            error,
            '데이터를 불러오지 못했습니다.'
          )
          setFetchError(message)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void fetchData()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const handleNavigate = (screen: Screen) => {
    router.push(SCREEN_PATHS[screen])
  }

  const headerTitle = session
    ? `${MODE_LABEL[session.mode]} · ${session.target}`
    : '세션 상세'

  return (
    <>
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => router.push('/report/list')}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <h2 className="text-base font-black text-slate-950">{headerTitle}</h2>
        <div className="h-9 w-9" aria-hidden />
      </header>

      {/* 콘텐츠 */}
      <div className="absolute inset-x-3.5 bottom-17.5 top-16 overflow-auto pb-3 lg:static lg:overflow-visible lg:pb-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">불러오는 중...</p>
          </div>
        ) : fetchError ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">{fetchError}</p>
          </div>
        ) : (
          <>
            {/* 리포트 요약 */}
            <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm lg:flex lg:items-center lg:gap-3">
              <button
                type="button"
                onClick={() => router.push('/report/list')}
                className="hidden h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 lg:grid"
                aria-label="리포트 목록으로 돌아가기"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-slate-400">
                  이 세션 종합 점수
                </p>
                <p className="mt-0.5 text-2xl font-black text-blue-600">
                  {report?.totalScore != null
                    ? `${report.totalScore}점`
                    : REPORT_STATUS_LABEL['MISSING']}
                </p>
              </div>
            </div>

            {/* 턴 목록 */}
            {answers.length === 0 ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-slate-400">답변 기록이 없습니다.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {answers.map((answer, index) => {
                  const turn = index + 1
                  const duration = formatDuration(answer.durationSec)
                  const eyeContactScore = formatMetric(answer.eyeContactScore)
                  const postureScore = formatMetric(answer.postureScore)
                  return (
                    <li key={answer.answerId}>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/feedback?turn=${turn}&answerId=${answer.answerId}&from=report`
                          )
                        }
                        className="w-full rounded-[18px] border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-black text-blue-700">
                            T{turn}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-slate-950">
                              {answer.questionText}
                            </p>
                            {duration && (
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                                <Clock size={10} strokeWidth={2.5} />
                                {duration}
                              </p>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                              <span
                                className={`rounded-full px-2 py-0.5 font-black ${STT_STATUS_COLOR[answer.sttStatus]}`}
                              >
                                {STT_STATUS_LABEL[answer.sttStatus]}
                              </span>
                              {eyeContactScore != null && (
                                <span>시선 {eyeContactScore}점</span>
                              )}
                              {postureScore != null && (
                                <span>자세 {postureScore}점</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-slate-300"
                            strokeWidth={2.5}
                          />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </div>

      <BottomNav
        current="report"
        onNavigate={handleNavigate}
        disabledScreens={hasActiveSession ? [] : ['live']}
      />
    </>
  )
}
