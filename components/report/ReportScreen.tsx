'use client'

import { ScoreRing } from '@/components/report/ScoreRing'
import { TurnChart } from '@/components/report/TurnChart'
import { StrengthWeakness } from '@/components/report/StrengthWeakness'
import { TaskList } from '@/components/report/TaskList'
import { MemoryChips } from '@/components/report/MemoryChips'
import { BottomNav } from '@/components/layout/BottomNav'
import type { Screen } from '@/types'

interface ReportScreenProps {
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
}

const STRENGTHS = ['논리적 구조', '전달력 유지', '핵심 키워드 사용']
const WEAKNESSES = ['구체성 부족', '답변 길이 편차', '전환 표현 어색함']
const TASKS = [
  { icon: '🎙', title: '구체적 사례 답변 연습', sub: 'STAR 기법으로 사례 구체화' },
  { icon: '◷', title: '답변 확장 연습', sub: '20초 → 45초 구조 확장' },
]
const MEMORY_CHIPS = ['선호 톤: 차분/신뢰감', '목표 직무: IT 기획', '반복 약점: 구체성 부족', '학습 목표: 논리적 구조 강화']

export function ReportScreen({ onNavigate, onToast }: ReportScreenProps) {
  return (
    <>
      {/* 헤더 */}
      <div
        className="h-[138px] px-[18px] pt-12 text-white"
        style={{ background: 'linear-gradient(135deg,#2e96ff 0%,#3d72ff 42%,#7c3aed 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[25px] font-black">세션 리포트 ✦</div>
          <div className="relative grid h-[45px] w-[45px] place-items-center overflow-hidden rounded-full bg-white/90 shadow-lg">
            <span className="text-xl">🧑</span>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div
        className="absolute left-3.5 right-3.5 overflow-auto pb-3"
        style={{ top: 120, bottom: 70 }}
      >
        {/* 세션 선택 */}
        <div className="mb-2 flex items-center justify-between font-black text-sm">
          2024.05.23 면접 세션
          <button className="rounded-xl border border-blue-200 bg-white px-2.5 py-1.5 text-[13px] font-black text-blue-600">
            ⇧ 공유
          </button>
        </div>

        {/* 종합 점수 */}
        <div className="mb-2.5 grid grid-cols-[112px_1fr] items-center gap-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
          <ScoreRing score={82} />
          <div>
            <h3 className="text-sm font-black text-blue-700">지난 세션 대비 +12점 상승!</h3>
            <p className="mt-1 text-[11.5px] text-slate-500">논리적 구조와 답변 길이가 크게 개선되었어요.</p>
            <div className="mt-2 grid grid-cols-2 gap-[7px]">
              {[{ val: '78점', label: '평균 점수' }, { val: '상위 23%', label: '비슷한 사용자 대비' }].map(({ val, label }) => (
                <div key={label} className="rounded-xl border border-slate-200 p-2 text-center">
                  <b className="block text-[13px]">{val}</b>
                  <span className="block text-[10px] text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
          <TurnChart onPointClick={(_, msg) => onToast(msg)} />
        </div>

        {/* 강점 / 약점 */}
        <div className="mb-2.5">
          <StrengthWeakness strengths={STRENGTHS} weaknesses={WEAKNESSES} />
        </div>

        {/* 추천 과제 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
          <TaskList tasks={TASKS} onStart={onNavigate} />
        </div>

        {/* 저장된 피드백 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
          <h3 className="mb-1.5 flex items-center justify-between text-[15px] font-black">
            저장된 피드백
            <span className="text-[11px] text-blue-600">전체 보기 ›</span>
          </h3>
          <p className="text-[12.5px] text-slate-600">
            ❝ 결론을 먼저 말하는 연습이 좋아요! <span className="float-right">▱</span>
          </p>
        </div>

        {/* 개인 메모리 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm">
          <MemoryChips chips={MEMORY_CHIPS} />
        </div>

        {/* 다음 세션 CTA */}
        <button
          onClick={() => onNavigate('home')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-0 py-[15px] text-lg font-black text-white"
          style={{ background: 'linear-gradient(135deg,#1689ff,#7c3aed)', boxShadow: '0 13px 26px rgba(55,86,255,.25)' }}
        >
          다음 세션 추천 ›
        </button>
      </div>

      <BottomNav current="report" onNavigate={onNavigate} />
    </>
  )
}