'use client'

import { ChevronLeft, Eye } from 'lucide-react'

import { ScoreRing } from '@/components/report/ScoreRing'
import { TurnChart } from '@/components/report/TurnChart'
import { StrengthWeakness } from '@/components/report/StrengthWeakness'
import { BottomNav } from '@/components/layout/BottomNav'
import type { Screen } from '@/types'
import type { ReportData } from '@/types/report'

interface ReportScreenProps {
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
  data: ReportData
}

function formatDeltaScore(deltaScore: number) {
  if (deltaScore > 0) {
    return `지난 세션 대비 +${deltaScore}점 상승!`
  }

  if (deltaScore < 0) {
    return `지난 세션 대비 ${deltaScore}점 하락`
  }

  return '지난 세션과 같은 점수예요.'
}

export function ReportScreen({ onNavigate, onToast, data }: ReportScreenProps) {
  const { summary } = data
  const scoreStats = [
    { val: `${summary.averageScore}점`, label: '평균 점수' },
    { val: `상위 ${summary.peerPercentile}%`, label: '비슷한 사용자 대비' },
  ]

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
      <div className="absolute inset-x-3.5 bottom-[70px] top-16 overflow-auto pb-3 lg:static lg:overflow-visible lg:pb-0">
        {/* 종합 점수 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3 text-lg font-black text-slate-950">
            <span className="min-w-0">
              최근 면접 세션 : {summary.latestSessionDate}
            </span>
            <button
              type="button"
              onClick={() => onNavigate('reportList')}
              className="inline-flex h-5.5 lg:h-8 shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 text-[11px] font-black text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 lg:text-xs"
            >
              <Eye size={14} strokeWidth={2.4} />
              세션별 리포트 확인
            </button>
          </div>

          <div className="grid grid-cols-[112px_1fr] items-center gap-2.5">
            <ScoreRing score={summary.score} />
            <div>
              <h3 className="text-sm font-black text-blue-700">
                {formatDeltaScore(summary.previousDeltaScore)}
              </h3>
              <p className="mt-1 text-[11.5px] text-slate-500">
                {data.improvementNote}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-[7px]">
                {scoreStats.map(({ val, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 p-2 text-center"
                  >
                    <b className="block text-[13px]">{val}</b>
                    <span className="block text-[10px] text-slate-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
          <TurnChart
            points={data.turnChartPoints}
            onPointClick={(_, msg) => onToast(msg)}
          />
        </div>

        {/* 강점 / 약점 */}
        <div className="mb-2.5">
          <StrengthWeakness
            strengths={data.strengths}
            weaknesses={data.weaknesses}
          />
        </div>
      </div>

      <BottomNav current="report" onNavigate={onNavigate} />
    </>
  )
}
