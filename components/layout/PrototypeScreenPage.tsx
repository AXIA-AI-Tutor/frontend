'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

import { FeedbackScreen } from '@/components/feedback/FeedbackScreen'
import { HomeScreen } from '@/components/home/HomeScreen'
import { LiveScreen } from '@/components/live/LiveScreen'
import { ReportScreen } from '@/components/report/ReportScreen'
import { Toast } from '@/components/ui/Toast'
import type { Screen } from '@/types'

const SCREEN_PATHS: Record<Screen, string> = {
  home: '/',
  live: '/live',
  feedback: '/feedback',
  report: '/report',
}

interface PrototypeScreenPageProps {
  current: Screen
}

export function PrototypeScreenPage({ current }: PrototypeScreenPageProps) {
  const router = useRouter()
  const [toast, setToast] = useState({ show: false, message: '' })

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message })
  }, [])

  const hideToast = useCallback(() => {
    setToast((toastState) => ({ ...toastState, show: false }))
  }, [])

  const navigate = useCallback(
    (screen: Screen) => {
      router.push(SCREEN_PATHS[screen])
    },
    [router]
  )

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
        <main className="flex justify-center">
          <section className="relative min-h-[812px] w-full max-w-[430px] overflow-hidden bg-[#f8faff]">
            {screenComponents[current]}
          </section>
        </main>
      </div>

      <Toast message={toast.message} show={toast.show} onHide={hideToast} />
    </div>
  )
}
