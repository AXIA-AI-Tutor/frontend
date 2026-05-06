'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Bell,
  Home,
  Loader2,
  LogOut,
  Mic,
  Settings,
} from 'lucide-react'

import { AuthGate } from '@/components/auth/AuthGate'
import { FeedbackScreen } from '@/components/feedback/FeedbackScreen'
import { HomeScreen } from '@/components/home/HomeScreen'
import { LiveScreen } from '@/components/live/LiveScreen'
import { ReportListScreen } from '@/components/report/ReportListScreen'
import { ReportScreen } from '@/components/report/ReportScreen'
import { Toast } from '@/components/ui/Toast'
import { getMockFeedbackData } from '@/lib/mock/feedback.mock'
import { getMockTurn } from '@/lib/mock/live.mock'
import { MOCK_REPORT_DATA } from '@/lib/mock/report.mock'
import { MOCK_REPORT_LIST } from '@/lib/mock/sessions.mock'
import { useAuthStore } from '@/lib/stores/auth'
import { cn } from '@/lib/utils'
import type { Screen } from '@/types'
import type { FeedbackSource } from '@/types/feedback'

const SCREEN_PATHS: Record<Screen, string> = {
  home: '/',
  live: '/live',
  feedback: '/feedback',
  report: '/report',
  reportList: '/report/list',
}

const SCREEN_LABELS: Record<Screen, string> = {
  home: '홈',
  live: '실시간 연습',
  feedback: '턴 피드백',
  report: '세션 리포트',
  reportList: '리포트 목록',
}

const DESKTOP_NAV_ITEMS = [
  {
    icon: Home,
    label: '홈',
    description: '세션 준비',
    screen: 'home' as Screen,
  },
  {
    icon: Mic,
    label: '실시간 연습',
    description: '답변 진행',
    screen: 'live' as Screen,
  },
  {
    icon: BarChart3,
    label: '세션 리포트',
    description: '성장 기록',
    screen: 'report' as Screen,
  },
]

interface PrototypeScreenPageProps {
  current: Screen
  turnNumber?: number
  feedbackSource?: FeedbackSource
  title?: string
  children?: React.ReactNode
}

interface NavigationOptions {
  turnNumber?: number
  feedbackSource?: FeedbackSource
}

export function PrototypeScreenPage({
  current,
  turnNumber = 1,
  feedbackSource = 'live',
  title,
  children,
}: PrototypeScreenPageProps) {
  const router = useRouter()
  const [toast, setToast] = useState({ show: false, message: '' })
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const user = useAuthStore((state) => state.user)
  const authStatus = useAuthStore((state) => state.status)
  const logout = useAuthStore((state) => state.logout)

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message })
  }, [])

  const hideToast = useCallback(() => {
    setToast((toastState) => ({ ...toastState, show: false }))
  }, [])

  const navigate = useCallback(
    (screen: Screen, options?: NavigationOptions) => {
      const path = SCREEN_PATHS[screen]

      if (options?.turnNumber) {
        const params = new URLSearchParams({
          turn: String(options.turnNumber),
        })
        if (options.feedbackSource) {
          params.set('from', options.feedbackSource)
        }
        router.push(`${path}?${params.toString()}`)
        return
      }

      router.push(path)
    },
    [router]
  )

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()
      // router.replace 대신 window.location.replace를 사용해 전체 페이지 이동을 강제한다.
      // client-side router와 AuthGate의 useEffect가 경쟁하면서 /live에 남는 문제를 방지한다.
      window.location.replace('/login')
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '로그아웃하지 못했습니다.'
      )
      setIsLoggingOut(false)
    }
  }, [isLoggingOut, logout, showToast])

  const screenComponents: Record<Screen, React.ReactNode> = {
    home: (
      <HomeScreen
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        onNavigate={navigate}
        onToast={showToast}
      />
    ),
    live: (
      <LiveScreen
        key={`live-${turnNumber}`}
        initialTurnNumber={turnNumber}
        onNavigate={navigate}
        onToast={showToast}
      />
    ),
    feedback: (
      <FeedbackScreen
        turnNumber={turnNumber}
        turn={getMockTurn(turnNumber)}
        feedback={getMockFeedbackData(turnNumber)}
        feedbackSource={feedbackSource}
        onNavigate={navigate}
        onToast={showToast}
      />
    ),
    report: (
      <ReportScreen
        data={MOCK_REPORT_DATA}
        onNavigate={navigate}
        onToast={showToast}
      />
    ),
    reportList: (
      <ReportListScreen
        items={MOCK_REPORT_LIST}
        onNavigate={navigate}
        onToast={showToast}
      />
    ),
  }

  const isAuthenticated = authStatus === 'authenticated' && Boolean(user)
  const userDisplayName = isAuthenticated
    ? user?.nickname || user?.email || '사용자'
    : '게스트'
  const authStatusLabel = isAuthenticated ? '로그인됨' : '개발 모드'
  const pageTitle = title ?? SCREEN_LABELS[current]
  const content = children ?? screenComponents[current]

  return (
    <AuthGate>
      <div className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(77,154,255,.18),transparent_32%),radial-gradient(circle_at_88%_8%,rgba(139,92,246,.16),transparent_38%),linear-gradient(180deg,#fbfcff_0%,#f5f7ff_100%)]">
        <div className="mx-auto max-w-[1480px] px-0 pb-0 pt-0 lg:px-6 lg:pb-6 lg:pt-5">
          <header className="hidden items-center justify-between border-b border-slate-200 pb-4 lg:flex">
            <div>
              <p className="text-sm font-bold text-blue-600">AI 코치</p>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="mr-2 hidden text-right xl:block">
                <strong className="block text-sm font-black text-slate-900">
                  {userDisplayName}
                </strong>
                <span className="block text-xs font-bold text-slate-400">
                  {authStatusLabel}
                </span>
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm"
                aria-label="알림"
              >
                <Bell size={18} />
              </button>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm"
                aria-label="설정"
              >
                <Settings size={18} />
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-wait disabled:opacity-60"
                  aria-label="로그아웃"
                >
                  {isLoggingOut ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <LogOut size={18} />
                  )}
                </button>
              ) : null}
            </div>
          </header>

          <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6 lg:pt-5">
            <aside className="hidden flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:flex">
              <div className="mb-4 rounded-lg bg-slate-50 p-3">
                <strong className="block text-sm text-slate-950">
                  연습 워크스페이스
                </strong>
                <span className="mt-1 block text-xs text-slate-500">
                  면접과 발표 준비를 한 곳에서 관리합니다.
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {DESKTOP_NAV_ITEMS.map(
                  ({ icon: Icon, label, description, screen }) => (
                    <button
                      key={screen}
                      type="button"
                      onClick={() => navigate(screen)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                        current === screen ||
                          (current === 'reportList' && screen === 'report') ||
                          (current === 'feedback' &&
                            feedbackSource === 'report' &&
                            screen === 'report')
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                      )}
                    >
                      <Icon size={18} />
                      <span>
                        <span className="block text-sm font-black">
                          {label}
                        </span>
                        <span className="block text-xs text-slate-400">
                          {description}
                        </span>
                      </span>
                    </button>
                  )
                )}
              </nav>
            </aside>

            <main className="flex justify-center lg:block">
              <section
                className={cn(
                  'relative min-h-[812px] w-full max-w-[430px] overflow-hidden bg-[#f8faff] lg:max-w-none lg:overflow-visible lg:bg-transparent',
                  current === 'home'
                    ? 'lg:min-h-0'
                    : 'lg:min-h-[calc(100vh-132px)]'
                )}
              >
                {content}
              </section>
            </main>
          </div>
        </div>

        <Toast message={toast.message} show={toast.show} onHide={hideToast} />
      </div>
    </AuthGate>
  )
}
