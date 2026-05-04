'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RotateCcw } from 'lucide-react'

import { createLoginRedirectPath } from '@/lib/auth/routes'
import { selectIsAuthChecking, useAuthStore } from '@/lib/stores/auth'

interface AuthGateProps {
  children: React.ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter()
  const status = useAuthStore((state) => state.status)
  const errorMessage = useAuthStore((state) => state.errorMessage)
  const refreshCurrentUser = useAuthStore((state) => state.refreshCurrentUser)
  const isCheckingSession = selectIsAuthChecking(status)

  const navigateToLogin = useCallback(() => {
    router.replace(
      createLoginRedirectPath(window.location.pathname, window.location.search)
    )
  }, [router])

  useEffect(() => {
    if (status === 'unauthenticated') {
      navigateToLogin()
    }
  }, [navigateToLogin, status])

  if (status === 'authenticated') {
    return children
  }

  if (status === 'error') {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f9fc] px-5 text-slate-950">
        <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm">
          <h1 className="text-lg font-black">로그인 상태 확인 실패</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {errorMessage || '현재 로그인한 사용자를 불러오지 못했습니다.'}
          </p>
          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => void refreshCurrentUser()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-black text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <RotateCcw size={17} />
              다시 확인
            </button>
            <button
              type="button"
              onClick={navigateToLogin}
              className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              로그인 화면으로
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9fc] px-5 text-slate-950">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm">
        <Loader2
          className={isCheckingSession ? 'animate-spin text-blue-600' : ''}
          size={18}
        />
        로그인 상태 확인 중
      </div>
    </main>
  )
}
