'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

import { BottomNav } from '@/components/layout/BottomNav'
import type { AnswerResponse } from '@/types/answer'
import type { ReportListItem } from '@/types/report'
import type { Screen } from '@/types'
import type { SessionMode } from '@/types/session'

interface SessionAnswerListScreenProps {
  item: ReportListItem
  answers: AnswerResponse[]
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

function formatDuration(sec: number | null) {
  if (sec == null) return null
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}

export function SessionAnswerListScreen({
  item,
  answers,
}: SessionAnswerListScreenProps) {
  const router = useRouter()
  const { session, report } = item

  const handleNavigate = (screen: Screen) => {
    router.push(SCREEN_PATHS[screen])
  }

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
        <h2 className="text-base font-black text-slate-950">
          {MODE_LABEL[session.mode]} · {session.target}
        </h2>
        <div className="h-9 w-9" aria-hidden />
      </header>

      {/* 콘텐츠 */}
      <div className="absolute inset-x-3.5 bottom-[70px] top-16 overflow-auto pb-3 lg:static lg:overflow-visible lg:pb-0">
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
                : '집계 중'}
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
              return (
                <li key={answer.answerId}>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/feedback?turn=${turn}&from=report`)
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
      </div>

      <BottomNav current="report" onNavigate={handleNavigate} />
    </>
  )
}
