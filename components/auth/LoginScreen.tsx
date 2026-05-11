'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react'

import { CoachAvatar } from '@/components/ui/CoachAvatar'
import { useAvatarStore } from '@/lib/stores/avatar'
import {
  AUTH_REDIRECT_STORAGE_KEY,
  AUTH_ROUTE_GUARD_COOKIE_NAME,
  getRedirectPathFromSearch,
} from '@/lib/auth/routes'
import { getGoogleOAuthAuthorizationUrl } from '@/lib/api/auth'
import { selectIsAuthChecking, useAuthStore } from '@/lib/stores/auth'

// 하드코딩 필요 판단: 로그인 화면 기능 설명 카피 (UI 고정)
const CHECK_ITEMS = ['세션 기록 이어보기', '맞춤 피드백 저장', '연습 자료 관리']

function getRequestedRedirectPath() {
  return getRedirectPathFromSearch(window.location.search)
}

function storeRequestedRedirectPath() {
  const redirectPath = getRequestedRedirectPath()

  try {
    window.sessionStorage.setItem(AUTH_REDIRECT_STORAGE_KEY, redirectPath)
  } catch {
    return
  }
}

function writePendingRouteGuardCookie() {
  const secureAttribute =
    window.location.protocol === 'https:' ? '; Secure' : ''

  document.cookie = `${AUTH_ROUTE_GUARD_COOKIE_NAME}=1; Path=/; Max-Age=300; SameSite=Lax${secureAttribute}`
}

export function LoginScreen() {
  const router = useRouter()
  const [isStartingLogin, setIsStartingLogin] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState('')
  const avatarGender = useAvatarStore((state) => state.gender)
  const status = useAuthStore((state) => state.status)
  const authErrorMessage = useAuthStore((state) => state.errorMessage)
  const markLoginRedirectStarted = useAuthStore(
    (state) => state.markLoginRedirectStarted
  )
  const clearSession = useAuthStore((state) => state.clearSession)
  const clearError = useAuthStore((state) => state.clearError)
  const isCheckingSession = selectIsAuthChecking(status) && !isStartingLogin
  const errorMessage =
    loginErrorMessage || (status === 'error' ? authErrorMessage : '')

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(getRequestedRedirectPath())
    }
  }, [router, status])

  const handleGoogleLogin = useCallback(() => {
    clearError()
    setLoginErrorMessage('')
    setIsStartingLogin(true)
    markLoginRedirectStarted()
    storeRequestedRedirectPath()
    writePendingRouteGuardCookie()

    try {
      window.location.assign(getGoogleOAuthAuthorizationUrl())
    } catch (error) {
      setLoginErrorMessage(
        error instanceof Error
          ? error.message
          : 'Google 로그인을 시작하지 못했습니다.'
      )
      clearSession()
      setIsStartingLogin(false)
    }
  }, [clearError, clearSession, markLoginRedirectStarted])

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-6 lg:px-8">
        <header className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <MessageSquareText size={19} />
            </span>
            <span className="text-lg font-black tracking-tight">AI 코치</span>
          </div>
        </header>

        <section className="grid flex-1 content-start items-start gap-8 py-6 lg:grid-cols-2 lg:py-12">
          <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:mx-0 lg:max-w-none lg:p-7">
            <div className="mb-6">
              <p className="text-sm font-bold text-blue-600">로그인</p>
              <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                연습 흐름을 그대로 이어가세요
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                면접과 발표 준비 기록을 안전하게 불러오고 다음 연습을 바로
                시작합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isCheckingSession || isStartingLogin}
              className="flex h-[52px] w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 text-left text-sm font-black text-slate-900 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-[17px] font-black text-blue-600">
                  G
                </span>
                <span className="truncate">
                  {isStartingLogin
                    ? 'Google 로그인으로 이동 중'
                    : 'Google로 계속하기'}
                </span>
              </span>
              {isCheckingSession || isStartingLogin ? (
                <Loader2
                  className="shrink-0 animate-spin text-slate-400"
                  size={18}
                />
              ) : (
                <ArrowRight className="shrink-0 text-slate-400" size={18} />
              )}
            </button>

            {errorMessage ? (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold leading-5 text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-5 grid gap-2">
              {CHECK_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-bold text-slate-600"
                >
                  <CheckCircle2 className="text-emerald-500" size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-blue-600"
                size={17}
              />
              <p>
                로그인 정보는 백엔드 세션으로 관리되며, 브라우저에 별도 인증
                토큰을 저장하지 않습니다.
              </p>
            </div>
          </div>

          <aside className="hidden overflow-hidden rounded-lg border border-slate-200 bg-[#101827] text-white shadow-sm lg:flex lg:flex-col">
            {/* 상단: 좌(텍스트) + 우(아바타) */}
            <div className="flex flex-1 gap-0">
              {/* 왼쪽 텍스트 영역 */}
              <div className="flex flex-1 flex-col p-6 gap-4">
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-blue-200">
                    Practice workspace
                  </p>
                  <h2 className="mt-2 text-xl font-black tracking-tight">
                    오늘의 답변을 더 선명하게
                  </h2>
                </div>
                <div className="flex flex-col">
                  <span className="inline-flex w-18 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-black text-white">
                    면접 모드
                  </span>
                  <p className="mt-3 text-2xl font-black leading-tight tracking-tight">
                    질문, 답변, 피드백을 한 화면에서
                  </p>
                  <div className="mt-16 grid gap-2">
                    <div className="h-2.5 w-34 rounded-full bg-emerald-400" />
                    <div className="h-2.5 w-50 rounded-full bg-white/70" />
                    <div className="h-2.5 w-42 rounded-full bg-blue-300" />
                  </div>
                </div>
              </div>

              {/* 오른쪽 아바타 영역 */}
              <div className="relative w-[52%] h-[340px] shrink-0 p-6 overflow-hidden">
                <CoachAvatar gender={avatarGender} />
              </div>
            </div>

            {/* 하단: 통계 */}
            <div className="grid grid-cols-3 border-t border-white/10">
              {/* 하드코딩 필요 판단: 로그인 화면 홍보용 고정 수치 (UI 전용) */}
              {[
                ['82점', '최근 점수'],
                ['3개', '추천 과제'],
                ['12분', '평균 연습'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="border-r border-white/10 p-4 last:border-r-0"
                >
                  <strong className="block text-2xl font-black">{value}</strong>
                  <span className="mt-1 block text-xs font-bold text-slate-300">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
