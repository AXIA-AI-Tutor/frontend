'use client'

import { useState, useCallback } from 'react'

import { TopBar } from '@/components/layout/TopBar'
import { PhoneFrame } from '@/components/layout/PhoneFrame'
import { Toast } from '@/components/ui/Toast'

import { HomeScreen } from '@/components/home/HomeScreen'
import { LiveScreen } from '@/components/live/LiveScreen'
import { FeedbackScreen } from '@/components/feedback/FeedbackScreen'
import { ReportScreen } from '@/components/report/ReportScreen'

import { screenData } from '@/lib/screenData'
import type { Screen } from '@/types'

// 화면별 사이드 패널 (왼쪽 흐름 설명 + 오른쪽 기능 설명)
function SidePanel({ side, screen }: { side: 'left' | 'right'; screen: Screen }) {
  const data = screenData[screen]

  if (side === 'left') {
    return (
      <aside className="flex flex-col gap-3.5">
        {/* 소개 */}
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 backdrop-blur-sm shadow-sm">
          <span className="mb-3.5 inline-block rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
            {data.crumb}
          </span>
          <h1
            className="mb-3 text-[28px] font-black leading-snug tracking-tight"
            dangerouslySetInnerHTML={{ __html: data.title }}
          />
          <p className="text-sm leading-relaxed text-slate-500">{data.text}</p>
        </section>

        {/* 흐름 예시 */}
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-[18px] backdrop-blur-sm shadow-sm">
          <h2 className="mb-3.5 flex items-center gap-2 text-base font-black">흐름 예시</h2>
          <div className="flex flex-col gap-2.5">
            {data.flow.map(([icon, title, text], i) => (
              <div key={i} className="relative grid grid-cols-[42px_1fr] items-center gap-2.5">
                {/* 점선 연결선 */}
                {i < data.flow.length - 1 && (
                  <span className="absolute left-5 top-[43px] h-4 border-l-2 border-dashed border-slate-300" />
                )}
                <div className="grid h-[42px] w-[42px] place-items-center rounded-[15px] border border-slate-200 bg-slate-50 text-xl">
                  {icon}
                </div>
                <div>
                  <strong className="block text-[13px]">{title}</strong>
                  <span className="block text-[12px] leading-snug text-slate-500">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interaction notes */}
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-[18px] backdrop-blur-sm shadow-sm">
          <h2 className="mb-3.5 flex items-center gap-2 text-base font-black text-blue-700">
            Interaction notes
          </h2>
          <div className="flex flex-col gap-2.5">
            {data.interactions.map(([icon, title, text], i) => (
              <div key={i} className="grid grid-cols-[32px_1fr] items-start gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-[11px] border border-slate-200 bg-slate-50 text-slate-700">
                  {icon}
                </div>
                <div>
                  <strong className="block text-[12.5px]">{title}</strong>
                  <span className="block text-[11.5px] leading-snug text-slate-500">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    )
  }

  // 오른쪽 패널 — 기능 설명
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white/80 p-5 backdrop-blur-sm shadow-sm">
      <h2 className="mb-3.5 text-xl font-black tracking-tight">{data.legend}</h2>
      <div className="flex flex-col gap-2.5">
        {data.features.map(([icon, title, text], i) => (
          <div
            key={i}
            className="grid grid-cols-[44px_1fr] items-start gap-3 rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-px hover:border-indigo-200 hover:shadow-md"
          >
            <div className="grid h-[31px] w-[31px] place-items-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-sm font-black text-white">
              {i + 1}
            </div>
            <div>
              <div className="text-[23px] leading-none">{icon}</div>
              <h4 className="mb-1 mt-0.5 text-[15px] font-black text-indigo-700">{title}</h4>
              <p className="text-[12.5px] leading-snug text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TIP */}
      <div className="mt-3 grid grid-cols-[34px_1fr] items-start gap-2.5 rounded-2xl border border-blue-200 bg-blue-50 p-3">
        <span className="text-2xl">💡</span>
        <div>
          <b className="block text-sm text-blue-700">TIP</b>
          <p className="mt-0.5 text-xs leading-snug text-slate-600">{data.tip}</p>
        </div>
      </div>
    </aside>
  )
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home')
  const [toast, setToast] = useState({ show: false, message: '' })

  const showToast = useCallback((msg: string) => {
    setToast({ show: true, message: msg })
  }, [])

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, show: false }))
  }, [])

  const navigate = useCallback((s: Screen) => {
    setScreen(s)
  }, [])

  // 화면별 컴포넌트 매핑
  const screenComponents: Record<Screen, React.ReactNode> = {
    home: <HomeScreen onNavigate={navigate} onToast={showToast} />,
    live: <LiveScreen onNavigate={navigate} onToast={showToast} />,
    feedback: <FeedbackScreen onNavigate={navigate} onToast={showToast} />,
    report: <ReportScreen onNavigate={navigate} onToast={showToast} />,
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 15% 0%, rgba(77,154,255,.18), transparent 32%),
          radial-gradient(circle at 88% 8%, rgba(139,92,246,.16), transparent 38%),
          linear-gradient(180deg,#fbfcff 0%,#f5f7ff 100%)
        `,
      }}
    >
      <div className="mx-auto max-w-[1480px] px-6 pb-7 pt-5">
        {/* 상단 탭 바 */}
        <TopBar current={screen} onChange={navigate} />

        {/* 3단 그리드 */}
        <main className="grid grid-cols-[285px_minmax(430px,1fr)_390px] items-start gap-5">
          {/* 왼쪽 — 흐름/인터랙션 설명 */}
          <SidePanel side="left" screen={screen} />

          {/* 가운데 — 폰 목업 */}
          <section className="flex min-h-[760px] justify-center pt-1">
            <PhoneFrame isDark={screen === 'live'}>
              {screenComponents[screen]}
            </PhoneFrame>
          </section>

          {/* 오른쪽 — 기능 설명 */}
          <SidePanel side="right" screen={screen} />
        </main>
      </div>

      {/* 토스트 */}
      <Toast message={toast.message} show={toast.show} onHide={hideToast} />
    </div>
  )
}