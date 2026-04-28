'use client'

import { useEffect, useRef, useState } from 'react'
import { TimerPill } from '@/components/live/TimerPill'
import { LiveMetrics } from '@/components/live/LiveMetrics'
import { CoachAvatarLive } from '@/components/live/CoachAvatarLive'
import { WaveCard } from '@/components/live/WaveCard'
import { TranscriptCard } from '@/components/live/TranscriptCard'
import { HintCard } from '@/components/live/HintCard'
import { BottomNav } from '@/components/layout/BottomNav'
import type { Screen } from '@/types'

interface LiveScreenProps {
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function LiveScreen({ onNavigate, onToast }: LiveScreenProps) {
  const [seconds, setSeconds] = useState(42)
  const [wpm, setWpm] = useState(148)
  const [eye, setEye] = useState(86)
  const [pose, setPose] = useState(8)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setSeconds((s) => (s + 1) % 61)
      setWpm(138 + Math.floor(Math.random() * 18))
      setEye(82 + Math.floor(Math.random() * 8))
      setPose(4 + Math.floor(Math.random() * 8))
    }, 2200)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [])

  const timeStr = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`

  return (
    <>
      {/* 헤더 */}
      <div className="h-[108px] bg-white px-[17px] pt-12">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="border-0 bg-transparent text-lg font-black text-slate-800">‹</button>
          <div className="text-lg font-black text-slate-900">실시간 연습</div>
          <button onClick={() => onNavigate('home')} className="border-0 bg-transparent font-black text-slate-800">나가기 ⇱</button>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div
        className="absolute left-3.5 right-3.5 overflow-auto pb-3"
        style={{ top: 104, bottom: 70 }}
      >
        <TimerPill time={`${timeStr} / 01:00`} turn={1} total={5} />
        <LiveMetrics wpm={wpm} eye={eye} pose={pose} />
        <CoachAvatarLive question={`자기소개와\n지원 동기를\n1분 안에\n말해보세요.`} />
        <WaveCard recTime={timeStr} />
        <TranscriptCard />
        <HintCard onClick={() => onToast('힌트가 현재 답변 목표에 적용되었습니다.')} />

        {/* 제어 버튼 */}
        <div className="mt-3 grid grid-cols-3 gap-[9px]">
          <button
            onClick={() => onToast('녹음이 중지되었습니다.')}
            className="rounded-[15px] border border-red-200 bg-white py-3 font-black text-red-500"
          >
            ■ 중지
          </button>
          <button
            onClick={() => { setSeconds(0); onToast('현재 질문을 다시 시작합니다.') }}
            className="rounded-[15px] border border-slate-200 bg-white py-3 font-black text-slate-700"
          >
            ↻ 다시
          </button>
          <button
            onClick={() => onNavigate('feedback')}
            className="rounded-[15px] border-0 bg-gradient-to-r from-blue-500 to-purple-700 py-3 font-black text-white"
          >
            › 다음
          </button>
        </div>
      </div>

      <BottomNav current="live" onNavigate={onNavigate} />
    </>
  )
}