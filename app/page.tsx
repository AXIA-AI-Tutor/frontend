'use client'

import { useState, useCallback } from 'react'

import { TopBar } from '@/components/layout/TopBar'
import { PhoneFrame } from '@/components/layout/PhoneFrame'
import { Toast } from '@/components/ui/Toast'

import { HomeScreen } from '@/components/home/HomeScreen'
import { LiveScreen } from '@/components/live/LiveScreen'
import { FeedbackScreen } from '@/components/feedback/FeedbackScreen'
import { ReportScreen } from '@/components/report/ReportScreen'

import type { Screen } from '@/types'

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

        <main className="flex justify-center">
          <section className="flex min-h-[760px] justify-center pt-1">
            <PhoneFrame isDark={screen === 'live'}>
              {screenComponents[screen]}
            </PhoneFrame>
          </section>
        </main>
      </div>

      {/* 토스트 */}
      <Toast message={toast.message} show={toast.show} onHide={hideToast} />
    </div>
  )
}
