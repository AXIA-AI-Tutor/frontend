'use client'

import { useState } from 'react'
import { ModeSegment } from '@/components/home/ModeSegment'
import { UploadGrid } from '@/components/home/UploadGrid'
import { SessionOptions } from '@/components/home/SessionOptions'
import { AvatarCard } from '@/components/home/AvatarCard'
import { SessionSummary } from '@/components/home/SessionSummary'
import { Toggle } from '@/components/ui/Toggle'
import { BottomNav } from '@/components/layout/BottomNav'
import type { Mode, Screen } from '@/types'

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
}

export function HomeScreen({ onNavigate, onToast }: HomeScreenProps) {
  const [mode, setMode] = useState<Mode>('면접')
  const [privacy, setPrivacy] = useState(true)

  const handleModeChange = (m: Mode) => {
    setMode(m)
    onToast(`${m} 모드로 전환되었습니다.`)
  }

  return (
    <>
      {/* 상단 그라디언트 헤더 */}
      <div
        className="h-[190px] px-[18px] pt-12 text-white"
        style={{ background: 'linear-gradient(135deg,#2e96ff 0%,#3d72ff 42%,#7c3aed 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[31px] font-black tracking-tight">
            AI 코치 <span style={{ filter: 'drop-shadow(0 8px 14px rgba(255,255,255,.24))' }}>✦</span>
          </div>
          {/* 프로필 아이콘 */}
          <div className="relative grid h-[45px] w-[45px] place-items-center overflow-hidden rounded-full bg-white/90 shadow-lg">
            <span className="text-xl">🧑</span>
            <span className="absolute bottom-1 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
        </div>
        <ModeSegment mode={mode} onChange={handleModeChange} />
      </div>

      {/* 스크롤 가능한 콘텐츠 */}
      <div
        className="absolute left-3.5 right-3.5 overflow-auto pb-3"
        style={{ top: 142, bottom: 70 }}
      >
        {/* 오늘의 연습 */}
        <div className="relative mb-2.5 min-h-[108px] rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm" style={{ paddingRight: 92 }}>
          <h3 className="mb-1.5 text-[17px] font-black">오늘의 연습</h3>
          <p className="text-[12.5px] leading-snug text-slate-600">
            {mode === '면접'
              ? '지원한 포지션에 맞는 예상 질문으로\n실력을 키워보세요.'
              : '발표자료 흐름에 맞춘 리허설 질문으로\n전달력을 다듬어보세요.'}
          </p>
          {/* 타겟 일러스트 (원형 데코) */}
          <div
            className="absolute right-4 top-6 h-[68px] w-[68px] rounded-full"
            style={{
              background: 'radial-gradient(circle at center,#fff 0 22%,#dce7ff 23% 42%,#fff 43% 52%,#a8bfff 53% 68%,#eef3ff 69%)',
              boxShadow: 'inset 0 0 0 1px #d5def8',
            }}
          />
        </div>

        {/* 자료 업로드 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm">
          <UploadGrid onUpload={(label) => onToast(`${label} 업로드 완료`)} />
        </div>

        {/* 세션 설정 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 shadow-sm overflow-hidden">
          <SessionOptions onSelect={(key, val) => onToast(`${val} 선택됨`)} />
        </div>

        {/* 아바타 카드 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 shadow-sm">
          <AvatarCard onChangeAvatar={(name) => onToast(`${name}(으)로 변경되었습니다.`)} />
        </div>

        {/* 지난 세션 요약 */}
        <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm">
          <SessionSummary onNavigate={onNavigate} />
        </div>

        {/* 프라이버시 설정 */}
        <div className="mb-2.5 flex items-center gap-2.5 rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm">
          <span className="grid h-9 w-9 place-items-center rounded-[14px] bg-blue-50 text-blue-700">🛡</span>
          <div className="flex-1">
            <b className="block text-[13px]">프라이버시 설정</b>
            <span className="block text-[11px] text-slate-500">
              {privacy ? '원본 영상은 저장하지 않아요' : '원본 영상 저장 옵션 확인 필요'}
            </span>
          </div>
          <Toggle
            on={privacy}
            onChange={() => {
              setPrivacy((v) => !v)
              onToast('프라이버시 설정이 변경되었습니다.')
            }}
            ariaLabel="프라이버시 토글"
          />
        </div>

        {/* 연습 시작 CTA */}
        <button
          onClick={() => onNavigate('live')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-0 py-[15px] text-lg font-black text-white"
          style={{ background: 'linear-gradient(135deg,#1689ff,#7c3aed)', boxShadow: '0 13px 26px rgba(55,86,255,.25)' }}
        >
          ▶ 연습 시작
        </button>
      </div>

      <BottomNav current="home" onNavigate={onNavigate} />
    </>
  )
}