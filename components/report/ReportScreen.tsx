'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, Eye } from 'lucide-react'

import { ScoreRing } from '@/components/report/ScoreRing'
import { TurnChart } from '@/components/report/TurnChart'
import { StrengthWeakness } from '@/components/report/StrengthWeakness'
import { BottomNav } from '@/components/layout/BottomNav'
import { getAnswerFeedbacks, getSessionAnswers } from '@/lib/api/answers'
import { getSessionReport } from '@/lib/api/reports'
import { getMySessions } from '@/lib/api/sessions'
import {
  isPracticeSessionActive,
  usePracticeSessionStore,
} from '@/lib/stores/practiceSession'
import type { Screen } from '@/types'
import type { ReportResponse, TurnChartPoint } from '@/types/report'
import type { SessionResponse } from '@/types/session'

interface ReportScreenProps {
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`
}

function splitLines(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function getTurnXPositions(count: number): number[] {
  if (count === 1) return [50]
  return Array.from({ length: count }, (_, i) =>
    Math.round(18 + (i / (count - 1)) * 62)
  )
}

function scoreToY(score: number): number {
  return Math.max(5, Math.min(95, 100 - score))
}

export function ReportScreen({ onNavigate, onToast }: ReportScreenProps) {
  const hasActiveSession = usePracticeSessionStore((state) =>
    isPracticeSessionActive(state.sessionStart)
  )
  const [fetchState, setFetchState] = useState<
    'loading' | 'empty' | 'done' | 'error'
  >('loading')
  const [latestSession, setLatestSession] = useState<SessionResponse | null>(
    null
  )
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [averageScore, setAverageScore] = useState<number | null>(null)
  const [chartPoints, setChartPoints] = useState<TurnChartPoint[]>([])
  const [strengths, setStrengths] = useState<string[]>([])
  const [weaknesses, setWeaknesses] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const sessions = await getMySessions()
        const completed = sessions.filter((s) => s.status === 'COMPLETED')

        if (completed.length === 0) {
          if (!cancelled) setFetchState('empty')
          return
        }

        const latest = completed[0]

        const [answers, allReports] = await Promise.all([
          getSessionAnswers(latest.id),
          Promise.all(
            completed.map((s) => getSessionReport(s.id).catch(() => null))
          ),
        ])

        const latestReport = allReports[0] ?? null
        const validScores = allReports
          .filter((r): r is NonNullable<typeof r> => r?.totalScore != null)
          .map((r) => r.totalScore!)
        const avg =
          validScores.length > 0
            ? Math.round(
                validScores.reduce((a: number, b: number) => a + b, 0) /
                  validScores.length
              )
            : null

        const feedbackResults = await Promise.all(
          answers.map((a) => getAnswerFeedbacks(a.answerId).catch(() => []))
        )

        const xPositions = getTurnXPositions(answers.length)
        const points: TurnChartPoint[] = answers.map((_answer, i) => {
          const feedbacks = feedbackResults[i]
          const latest = feedbacks[feedbacks.length - 1] ?? null
          const scores = [
            latest?.structureScore,
            latest?.specificityScore,
            latest?.relevanceScore,
            latest?.deliveryScore,
          ].filter((s): s is number => s != null)
          const score =
            scores.length > 0
              ? Math.round(
                  scores.reduce((a: number, b: number) => a + b, 0) /
                    scores.length
                )
              : 50
          return {
            x: xPositions[i],
            y: scoreToY(score),
            label: `Q${i + 1}`,
            msg: `Q${i + 1}: ${score}점`,
          }
        })

        if (!cancelled) {
          setLatestSession(latest)
          setReport(latestReport)
          setAverageScore(avg)
          setChartPoints(points)
          setStrengths(splitLines(latestReport?.strengths))
          setWeaknesses(splitLines(latestReport?.improvements))
          setFetchState('done')
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : '리포트를 불러오지 못했습니다.'
          onToast(message)
          setFetchState('error')
        }
      }
    }

    void fetchData()
    return () => {
      cancelled = true
    }
  }, [onToast])

  return (
    <>
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          aria-label="홈으로 돌아가기"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <h2 className="text-base font-black text-slate-950">세션 리포트</h2>
        <div className="h-9 w-9" aria-hidden />
      </header>

      {/* 콘텐츠 */}
      <div className="absolute inset-x-3.5 bottom-17.5 top-16 overflow-auto pb-3 lg:static lg:overflow-visible lg:pb-0">
        {fetchState === 'loading' && (
          <div className="flex h-full items-center justify-center lg:h-[calc(100vh-200px)]">
            <p className="text-sm text-slate-400">불러오는 중...</p>
          </div>
        )}

        {fetchState === 'empty' && (
          <div className="flex h-full flex-col items-center justify-center gap-3 lg:h-[calc(100vh-200px)]">
            <p className="text-sm text-slate-400 lg:text-base lg:font-bold">
              완료된 세션이 없습니다. 세션을 진행해보세요.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white transition-colors hover:bg-blue-700"
            >
              홈으로
            </button>
          </div>
        )}

        {fetchState === 'error' && (
          <div className="flex h-full items-center justify-center lg:h-[calc(100vh-200px)]">
            <p className="text-sm text-slate-400 lg:text-base lg:font-bold">
              리포트를 불러오지 못했습니다.
            </p>
          </div>
        )}

        {fetchState === 'done' && (
          <>
            {/* 종합 점수 */}
            <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3 text-lg font-black text-slate-950">
                <span className="min-w-0 truncate text-sm">
                  최근 세션 : {formatDate(latestSession?.completedAt)}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('reportList')}
                  className="inline-flex h-5.5 shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 text-[11px] font-black text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 lg:h-8 lg:text-xs"
                >
                  <Eye size={14} strokeWidth={2.4} />
                  세션별 리포트 확인
                </button>
              </div>

              <div className="grid grid-cols-[112px_1fr] items-center gap-2.5">
                <ScoreRing score={report?.totalScore ?? 0} />
                <div>
                  {averageScore != null && (
                    <div className="mt-2 grid grid-cols-1 gap-1.75">
                      <div className="rounded-xl border border-slate-200 p-2 text-center">
                        <b className="block text-[13px]">{averageScore}점</b>
                        <span className="block text-[10px] text-slate-400">
                          세션 평균 점수
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 질문별 차트 */}
            {chartPoints.length > 0 && (
              <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
                <TurnChart
                  points={chartPoints}
                  onPointClick={(_, msg) => onToast(msg)}
                />
              </div>
            )}

            {/* 강점 / 개선점 */}
            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div className="mb-2.5">
                <StrengthWeakness
                  strengths={strengths}
                  weaknesses={weaknesses}
                />
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav
        current="report"
        onNavigate={onNavigate}
        disabledScreens={hasActiveSession ? [] : ['live']}
      />
    </>
  )
}
