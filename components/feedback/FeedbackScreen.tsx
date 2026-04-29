'use client'

import { FeedbackSheet } from '@/components/feedback/FeedbackSheet'
import { BottomNav } from '@/components/layout/BottomNav'
import type { Screen } from '@/types'

interface FeedbackScreenProps {
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
}

export function FeedbackScreen({ onNavigate, onToast }: FeedbackScreenProps) {
  return (
    <>
      {/* 어두운 배경 */}
      <div
        className="absolute inset-0 px-[18px] pt-[54px] text-white"
        style={{
          background: 'linear-gradient(180deg,#172033,#0f172a)',
          opacity: 0.9,
        }}
      >
        <div className="flex items-center justify-between text-sm font-black text-blue-200">
          <span>연습 중</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1.5">
            ◷ 00:42
          </span>
        </div>
        <div className="mt-1 text-lg font-black">Q3. 지원 동기</div>
        <div className="mt-3 rounded-[17px] border border-white/20 bg-white/10 p-3.5">
          <b className="text-lg leading-snug">
            우리 회사와 해당 직무에 지원한
            <br />
            이유를 말씀해 주세요.
          </b>
        </div>
        <div className="mt-4 rounded-[14px] bg-white/10 p-3.5 text-[12px] leading-relaxed text-blue-100">
          <b className="block text-white">내 답변</b>
          평소 IT 기술을 활용해 사람들의 생활을 편리하게 만드는 일에 관심이
          많았습니다. 귀사의 데이터 플랫폼은 다양한 산업에서 가치 있는 서비스를
          제공하고 있어 이 곳에서 제 역량을 발휘하고 싶어 지원했습니다.
        </div>
      </div>

      {/* 피드백 시트 */}
      <FeedbackSheet
        onNavigate={onNavigate}
        onSave={() => onToast('피드백이 개인 메모리에 저장되었습니다.')}
      />

      <BottomNav current="feedback" onNavigate={onNavigate} />
    </>
  )
}
