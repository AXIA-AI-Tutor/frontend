'use client'

import { useEffect, useState } from 'react'
import { Archive, ChevronRight } from 'lucide-react'

import { getSessionReport } from '@/lib/api/reports'
import { getMySessions } from '@/lib/api/sessions'
import { parseFeedbackText } from '@/lib/parseFeedback'
import type { Screen } from '@/types'

interface SessionSummaryProps {
  onNavigate: (screen: Screen) => void
}

interface SummaryData {
  averageScore: number | null
  sessionCount: number
  strengths: string | null
  improvements: string | null
}

export function SessionSummary({ onNavigate }: SessionSummaryProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<SummaryData | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchSummary() {
      try {
        const sessions = await getMySessions()
        const completed = sessions.filter((s) => s.status === 'COMPLETED')

        if (completed.length === 0) {
          if (!cancelled) {
            setData(null)
            setIsLoading(false)
          }
          return
        }

        const reports = await Promise.all(
          completed.map((s) => getSessionReport(s.id).catch(() => null))
        )

        const validScores = reports
          .filter((r): r is NonNullable<typeof r> => r?.totalScore != null)
          .map((r) => r.totalScore!)

        const averageScore =
          validScores.length > 0
            ? Math.round(
                validScores.reduce((a: number, b: number) => a + b, 0) /
                  validScores.length
              )
            : null

        const latestReport = reports[0] ?? null
        const strengths = parseFeedbackText(latestReport?.strengths)[0] ?? null
        const improvements =
          parseFeedbackText(latestReport?.improvements)[0] ?? null

        if (!cancelled) {
          setData({
            averageScore,
            sessionCount: completed.length,
            strengths,
            improvements,
          })
          setIsLoading(false)
        }
      } catch {
        if (!cancelled) setIsLoading(false)
      }
    }

    void fetchSummary()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <div className="flex items-center justify-between text-[15px]">
        <div className="flex items-center gap-2">
          <Archive className="text-blue-600" size={20} />
          <h3 className="text-base font-black text-slate-950">
            지난 세션 요약
          </h3>
        </div>
        <button
          onClick={() => onNavigate('report')}
          className="flex px-2 text-xs font-black text-slate-700"
        >
          자세히 보기 <ChevronRight size={14} />
        </button>
      </div>

      {isLoading ? (
        <div className="mt-[9px] border-t border-slate-100 pt-2.5 text-center">
          <p className="text-[12px] text-slate-400">불러오는 중...</p>
        </div>
      ) : data === null ? (
        <div className="mt-[9px] border-t border-slate-100 pt-2.5 text-center">
          <p className="text-[12px] text-slate-400">완료된 세션이 없습니다.</p>
        </div>
      ) : (
        <div className="mt-[9px] grid grid-cols-3 border-t border-slate-100 pt-2.5 text-center">
          <div>
            <b className="block text-[13px]">평균 점수</b>
            <span className="text-[12px] font-black text-blue-600">
              {data.averageScore != null ? `${data.averageScore}점` : '-'}
            </span>
            <small className="block text-[11px] text-slate-400">
              (최근 {data.sessionCount}회)
            </small>
          </div>
          <div>
            <b className="block text-[13px]">강점</b>
            <span className="text-[12px] font-black text-emerald-500">
              {data.strengths ?? '-'}
            </span>
          </div>
          <div>
            <b className="block text-[13px]">개선 포인트</b>
            <span className="text-[12px] font-black text-orange-500">
              {data.improvements ?? '-'}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
