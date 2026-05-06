'use client'

import { useState } from 'react'
import {
  ArrowRight,
  ClipboardList,
  Loader2,
  LogOut,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react'
import { ModeSegment } from '@/components/home/ModeSegment'
import { UploadGrid } from '@/components/home/UploadGrid'
import { SessionOptions } from '@/components/home/SessionOptions'
import { AvatarCard } from '@/components/home/AvatarCard'
import { SessionSummary } from '@/components/home/SessionSummary'
import { Toggle } from '@/components/ui/Toggle'
import { BottomNav } from '@/components/layout/BottomNav'
import { useAuthStore } from '@/lib/stores/auth'
import type { Mode, Screen } from '@/types'

interface HomeScreenProps {
  isLoggingOut: boolean
  onLogout: () => void
  onNavigate: (screen: Screen) => void
  onToast: (msg: string) => void
}

export function HomeScreen({
  isLoggingOut,
  onLogout,
  onNavigate,
  onToast,
}: HomeScreenProps) {
  const [mode, setMode] = useState<Mode>('면접')
  const user = useAuthStore((state) => state.user)
  const authStatus = useAuthStore((state) => state.status)
  const isAuthenticated = authStatus === 'authenticated' && Boolean(user)
  const profileName = isAuthenticated
    ? user?.nickname || user?.email || '사용자'
    : 'Guest'
  const profileInitial = profileName.slice(0, 1).toUpperCase()

  const handleModeChange = (m: Mode) => {
    setMode(m)
    onToast(`${m} 모드로 전환되었습니다.`)
  }

  return (
    <>
      <div className="lg:hidden">
        {/* 상단 그라디언트 헤더 */}
        <div
          className="h-16 px-[18px] pt-2 text-white"
          style={{
            background:
              'linear-gradient(135deg,#2e96ff 0%,#3d72ff 42%,#7c3aed 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-[31px] font-black tracking-tight">
              AI 코치{' '}
              <span
                style={{
                  filter: 'drop-shadow(0 8px 14px rgba(255,255,255,.24))',
                }}
              >
                ✦
              </span>
            </div>
            {/* 프로필 아이콘 */}
            <button
              type="button"
              onClick={isAuthenticated ? onLogout : undefined}
              disabled={!isAuthenticated || isLoggingOut}
              className="relative grid h-[45px] w-[45px] place-items-center overflow-hidden rounded-full bg-white/90 text-blue-700 shadow-lg disabled:cursor-default"
              aria-label={isAuthenticated ? '로그아웃' : '게스트 프로필'}
            >
              <span className="text-base font-black text-blue-700">
                {isLoggingOut ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isAuthenticated ? (
                  <LogOut size={18} />
                ) : (
                  profileInitial
                )}
              </span>
              {isAuthenticated ? (
                <span className="absolute bottom-1 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              ) : null}
            </button>
          </div>
        </div>

        <div className="px-[18px] pt-2">
          <ModeSegment
            mode={mode}
            onChange={handleModeChange}
            className="mt-0 border-slate-200 bg-white shadow-sm"
          />
        </div>

        {/* 스크롤 가능한 콘텐츠 */}
        <div
          className="absolute left-3.5 right-3.5 overflow-auto pb-2"
          style={{ top: 132, bottom: 70 }}
        >
          {/* 오늘의 연습 */}
          <div
            className="relative mb-2.5 min-h-[108px] rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm"
            style={{ paddingRight: 92 }}
          >
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
                background:
                  'radial-gradient(circle at center,#fff 0 22%,#dce7ff 23% 42%,#fff 43% 52%,#a8bfff 53% 68%,#eef3ff 69%)',
                boxShadow: 'inset 0 0 0 1px #d5def8',
              }}
            />
          </div>

          {/* 자료 업로드 */}
          <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm">
            <UploadGrid
              onUpload={(label) => onToast(`${label} 업로드 완료`)}
              onDelete={(label) => onToast(`${label} 삭제 완료`)}
            />
          </div>

          {/* 세션 설정 */}
          <div className="relative z-20 mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 shadow-sm">
            <SessionOptions onSelect={(_, val) => onToast(`${val} 선택됨`)} />
          </div>

          {/* 아바타 카드 */}
          <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 shadow-sm">
            <AvatarCard
              onChangeAvatar={(name) =>
                onToast(`${name}(으)로 변경되었습니다.`)
              }
            />
          </div>

          {/* 지난 세션 요약 */}
          <div className="mb-1.5 rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm">
            <SessionSummary onNavigate={onNavigate} />
          </div>

          {/* 연습 시작 CTA */}
          <button
            onClick={() => onNavigate('live')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-0 py-[15px] text-lg font-black text-white"
            style={{
              background: 'linear-gradient(135deg,#1689ff,#7c3aed)',
              boxShadow: '0 13px 26px rgba(55,86,255,.25)',
            }}
          >
            ▶ 연습 시작
          </button>
        </div>

        <BottomNav current="home" onNavigate={onNavigate} />
      </div>

      <div className="hidden lg:block">
        <div className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-bold text-blue-600">
                  {mode} 모드
                </p>
                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  오늘의 연습을 시작해볼까요?
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  자료를 업로드하고 세션 목표를 설정하면 AI 코치가 맞춤 질문을
                  준비합니다.
                </p>
              </div>
              <div className="w-56">
                <ModeSegment mode={mode} onChange={handleModeChange} />
              </div>
            </div>
          </section>

          <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* 왼쪽 컬럼 */}
            <div className="grid gap-4">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <UploadCloud className="text-blue-600" size={20} />
                  <h3 className="text-base font-black text-slate-950">
                    자료 업로드
                  </h3>
                </div>
                <UploadGrid
                  onUpload={(label) => onToast(`${label} 업로드 완료`)}
                  onDelete={(label) => onToast(`${label} 삭제 완료`)}
                />
              </section>

              <section className="relative z-20 rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                  <ClipboardList className="text-blue-600" size={20} />
                  <h3 className="text-base font-black text-slate-950">
                    세션 설정
                  </h3>
                </div>
                <SessionOptions
                  onSelect={(_, val) => onToast(`${val} 선택됨`)}
                />
              </section>
            </div>

            {/* 오른쪽 컬럼 */}
            <aside className="grid min-h-0 gap-4 grid-rows-[minmax(0,1fr)_auto]">
              <div className="min-h-0 rounded-lg border border-slate-200 bg-white shadow-sm [&>div]:h-full">
                <AvatarCard
                  onChangeAvatar={(name) =>
                    onToast(`${name}(으)로 변경되었습니다.`)
                  }
                />
              </div>

              <button
                type="button"
                onClick={() => onNavigate('live')}
                className="flex min-h-12 items-center justify-between rounded-lg border border-blue-200 bg-blue-600 px-5 py-3 text-left text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <span>
                  <span className="block text-md font-black">연습 시작</span>
                  <span className="block text-xs text-blue-100">
                    설정한 자료와 목표로 실시간 연습을 시작합니다.
                  </span>
                </span>
                <ArrowRight size={24} />
              </button>
            </aside>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <SessionSummary onNavigate={onNavigate} />
          </section>
        </div>
      </div>
    </>
  )
}
