'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { BottomNav } from '@/components/layout/BottomNav'
import type { Screen } from '@/types'
import type { ReportListItem } from '@/types/report'
import type { SessionDifficulty, SessionMode } from '@/types/session'

interface ReportListScreenProps {
  items: ReportListItem[]
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
}

const MODE_LABEL: Record<SessionMode, string> = {
  INTERVIEW: '면접',
  PRESENTATION: '발표',
}

const DIFFICULTY_LABEL: Record<SessionDifficulty, string> = {
  EASY: '쉬움',
  NORMAL: '보통',
  HARD: '어려움',
}

const DIFFICULTY_COLOR: Record<SessionDifficulty, string> = {
  EASY: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  NORMAL: 'border-blue-200 bg-blue-50 text-blue-700',
  HARD: 'border-orange-200 bg-orange-50 text-orange-700',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}`
}

function formatDuration(startedAt: string, completedAt: string | null) {
  if (!completedAt) return null
  const minutes = Math.round(
    (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 60000
  )
  return `${minutes}분 진행`
}

export function ReportListScreen({ items, onNavigate }: ReportListScreenProps) {
  const completed = items.filter((i) => i.session.status === 'COMPLETED')

  return (
    <>
      {/* 헤더 */}
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => onNavigate('report')}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <h2 className="text-base font-black text-slate-950">리포트 목록</h2>
        <div className="h-9 w-9" aria-hidden />
      </header>

      {/* 콘텐츠 */}
      <div className="absolute inset-x-3.5 bottom-[70px] top-16 overflow-auto pb-3 lg:static lg:overflow-visible lg:pb-0">
        {completed.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-slate-400">완료된 세션이 없습니다.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {completed.map(({ session, report }) => {
              const duration = formatDuration(
                session.startedAt,
                session.completedAt
              )
              return (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('feedback')}
                    className="w-full rounded-[18px] border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-black text-slate-950">
                            {MODE_LABEL[session.mode]} · {session.target}
                          </span>
                          <span
                            className={`inline-flex h-5 items-center rounded-full border px-2 text-[10px] font-black ${DIFFICULTY_COLOR[session.difficulty]}`}
                          >
                            {DIFFICULTY_LABEL[session.difficulty]}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span>
                            {formatDate(
                              session.completedAt ?? session.startedAt
                            )}
                          </span>
                          {duration && (
                            <>
                              <span>·</span>
                              <span>{duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {report?.totalScore != null ? (
                          <span className="text-sm font-black text-blue-600">
                            {report.totalScore}점
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-300">
                            집계 중
                          </span>
                        )}
                        <ChevronRight
                          size={16}
                          className="text-slate-300"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <BottomNav current="report" onNavigate={onNavigate} />
    </>
  )
}
