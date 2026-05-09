'use client'

import { useState } from 'react'
import {
  ArrowRight,
  ClipboardList,
  Loader2,
  LogOut,
  UploadCloud,
} from 'lucide-react'
import { UploadGrid } from '@/components/home/UploadGrid'
import { SessionOptions } from '@/components/home/SessionOptions'
import { AvatarCard } from '@/components/home/AvatarCard'
import { SessionSummary } from '@/components/home/SessionSummary'
import { BottomNav } from '@/components/layout/BottomNav'
import { getApiErrorMessage, isApiError } from '@/lib/api/client'
import { uploadSessionDocument } from '@/lib/api/documents'
import { createSession, startSession } from '@/lib/api/sessions'
import { useAuthStore } from '@/lib/stores/auth'
import {
  isPracticeSessionActive,
  usePracticeSessionStore,
} from '@/lib/stores/practiceSession'
import type { Screen } from '@/types'
import type { DocumentType } from '@/types/document'
import type {
  SessionDifficulty,
  SessionMode,
  SessionStartRequest,
  SessionTarget,
} from '@/types/session'

interface HomeScreenProps {
  isLoggingOut: boolean
  onLogout: () => void
  onNavigate: (screen: Screen, options?: { sessionId?: number }) => void
  onToast: (msg: string) => void
}

const SESSION_MODE_LABELS: Record<SessionMode, string> = {
  INTERVIEW: '면접',
  PRESENTATION: '발표',
}

export function HomeScreen({
  isLoggingOut,
  onLogout,
  onNavigate,
  onToast,
}: HomeScreenProps) {
  const createdSessionId = usePracticeSessionStore(
    (state) => state.createdSessionId
  )
  const setCreatedSessionId = usePracticeSessionStore(
    (state) => state.setCreatedSessionId
  )
  const clearCreatedSessionId = usePracticeSessionStore(
    (state) => state.clearCreatedSessionId
  )
  const setSessionStart = usePracticeSessionStore(
    (state) => state.setSessionStart
  )
  const hasActiveSession = usePracticeSessionStore((state) =>
    isPracticeSessionActive(state.sessionStart)
  )
  const [mode, setMode] = useState<SessionMode>('INTERVIEW')
  const [target, setTarget] = useState<SessionTarget>('BACKEND')
  const [difficulty, setDifficulty] = useState<SessionDifficulty>('NORMAL')
  const [sessionId, setSessionId] = useState<number | null>(
    () => createdSessionId
  )
  const [sessionOverlayVisible, setSessionOverlayVisible] = useState(
    () => createdSessionId === null
  )
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isStartingSession, setIsStartingSession] = useState(false)
  const user = useAuthStore((state) => state.user)
  const authStatus = useAuthStore((state) => state.status)
  const isAuthenticated = authStatus === 'authenticated' && Boolean(user)
  const profileName = isAuthenticated
    ? user?.nickname || user?.email || '사용자'
    : 'Guest'

  const handleOptionSelect = (
    key: 'difficulty' | 'target' | 'mode',
    value: SessionDifficulty | SessionTarget | SessionMode
  ) => {
    if (key === 'difficulty') {
      setDifficulty(value as SessionDifficulty)
      onToast(`${value} 선택됨`)
    } else if (key === 'target') {
      setTarget(value as SessionTarget)
      onToast(`${value} 선택됨`)
    } else if (key === 'mode') {
      setMode(value as SessionMode)
      onToast(
        `${SESSION_MODE_LABELS[value as SessionMode]} 모드로 전환되었습니다.`
      )
    }
  }

  const handleCreateSession = async () => {
    if (isCreatingSession) {
      return
    }

    setIsCreatingSession(true)

    try {
      const session = await createSession()

      setSessionId(session.id)
      setCreatedSessionId(session.id)
      setSessionOverlayVisible(false)
      // TODO(KAN-66): 백엔드 연동 확인 후 제거한다.
      // eslint-disable-next-line no-console
      console.log('[KAN-66] POST /api/sessions response', {
        sessionId: session.id,
        session,
      })
      onToast(`세션 ${session.id}번이 생성되었습니다.`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[KAN-66] POST /api/sessions failed', error)

      const message = getApiErrorMessage(error, '세션을 생성하지 못했습니다.')

      onToast(message)
    } finally {
      setIsCreatingSession(false)
    }
  }

  const handleDocumentUpload = async (
    docType: DocumentType,
    label: string,
    file: File
  ) => {
    if (!sessionId) {
      onToast('세션을 먼저 생성해 주세요.')
      throw new Error('세션 ID가 없습니다.')
    }

    try {
      const document = await uploadSessionDocument(sessionId, { docType, file })

      // TODO(KAN-66): 백엔드 연동 확인 후 제거한다.
      // eslint-disable-next-line no-console
      console.log('[KAN-66] document upload completed', {
        sessionId,
        docType,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
        document,
      })
      onToast(`${label} 업로드 완료`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[KAN-66] document upload failed', {
        sessionId,
        docType,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
        response:
          isApiError(error) && error.response
            ? {
                status: error.response.status,
                data: error.response.data,
              }
            : null,
        error,
      })

      const message = getApiErrorMessage(
        error,
        `${label} 업로드에 실패했습니다.`
      )

      onToast(message)
      throw error
    }
  }

  const handlePracticeStart = async () => {
    if (!sessionId) {
      onToast('세션을 먼저 생성해 주세요.')
      return
    }

    if (isStartingSession) {
      return
    }

    const payload: SessionStartRequest = {
      mode,
      target,
      difficulty,
    }

    setIsStartingSession(true)

    try {
      const response = await startSession(sessionId, payload)

      setSessionStart(response)
      clearCreatedSessionId()
      // TODO(KAN-66): 백엔드 연동 확인 후 제거한다.
      // eslint-disable-next-line no-console
      console.log('[KAN-66] PATCH /api/sessions/{sessionId}/start response', {
        sessionId,
        payload,
        response,
      })
      onToast('첫 질문이 생성되었습니다.')
      onNavigate('live', { sessionId })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[KAN-66] PATCH /api/sessions/{sessionId}/start failed', {
        sessionId,
        payload,
        response:
          isApiError(error) && error.response
            ? {
                status: error.response.status,
                data: error.response.data,
              }
            : null,
        error,
      })

      const message = getApiErrorMessage(error, '세션을 시작하지 못했습니다.')

      onToast(message)
    } finally {
      setIsStartingSession(false)
    }
  }

  return (
    <>
      <div className="lg:hidden">
        {/* 상단 그라디언트 헤더 */}
        <div className="h-16 bg-[linear-gradient(135deg,#2e96ff_0%,#3d72ff_42%,#7c3aed_100%)] px-4.5 pt-2 text-white">
          <div className="flex items-center justify-between">
            <div className="text-[31px] font-black tracking-tight">
              AI 코치{' '}
              <span className="drop-shadow-[0_8px_14px_rgba(255,255,255,.24)]">
                ✦
              </span>
            </div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onLogout}
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
        </div>

        {/* 스크롤 가능한 콘텐츠 */}
        <div className="absolute left-3.5 right-3.5 top-18 bottom-17.5 overflow-auto pb-2">
          {/* 오늘의 연습 */}
          <div className="relative mb-2.5 min-h-27 rounded-[18px] border border-slate-200 bg-white/92 p-3.5 pr-23 shadow-sm">
            <h3 className="mb-1.5 text-[17px] font-black">
              {profileName}님, 오늘도 연습을 시작해볼까요?
            </h3>
            <p className="text-[12.5px] leading-snug text-slate-600">
              {mode === 'INTERVIEW'
                ? '지원한 포지션에 맞는 예상 질문으로\n실력을 키워보세요.'
                : '발표자료 흐름에 맞춘 리허설 질문으로\n전달력을 다듬어보세요.'}
            </p>
            {/* 타겟 일러스트 (원형 데코) */}
            <div className="absolute right-4 top-6 h-17 w-17 rounded-full bg-[radial-gradient(circle_at_center,#fff_0_22%,#dce7ff_23%_42%,#fff_43%_52%,#a8bfff_53%_68%,#eef3ff_69%)] shadow-[inset_0_0_0_1px_#d5def8]" />
          </div>

          {/* 자료 업로드 */}
          <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 p-3.5 shadow-sm">
            <UploadGrid
              onUpload={handleDocumentUpload}
              onDelete={(_, label) => onToast(`${label} 삭제 완료`)}
            />
          </div>

          {/* 세션 설정 */}
          <div className="relative z-20 mb-2.5 rounded-[18px] border border-slate-200 bg-white/92 shadow-sm">
            <SessionOptions mode={mode} onSelect={handleOptionSelect} />
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
            onClick={handlePracticeStart}
            disabled={!sessionId || isStartingSession}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-0 bg-[linear-gradient(135deg,#1689ff,#7c3aed)] py-3.75 text-lg font-black text-white shadow-[0_13px_26px_rgba(55,86,255,.25)] disabled:cursor-wait disabled:opacity-75"
          >
            {isStartingSession ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              '▶'
            )}
            연습 시작
          </button>
        </div>

        {sessionOverlayVisible && (
          <div className="absolute left-3.5 right-3.5 top-18 bottom-17.5 z-30 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <button
              type="button"
              onClick={handleCreateSession}
              disabled={isCreatingSession}
              aria-busy={isCreatingSession}
              className="flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1689ff,#7c3aed)] py-3.75 text-lg font-black text-white shadow-[0_13px_26px_rgba(55,86,255,.25)] disabled:cursor-wait disabled:opacity-75"
            >
              {isCreatingSession ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                '▶'
              )}
              세션 시작하기
            </button>
          </div>
        )}

        <BottomNav
          current="home"
          onNavigate={onNavigate}
          disabledScreens={hasActiveSession ? [] : ['live']}
        />
      </div>

      <div className="hidden lg:block">
        <div className="space-y-4">
          <div className="relative space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm font-bold text-blue-600">
                {SESSION_MODE_LABELS[mode]} 모드
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                {profileName}님, 오늘도 연습을 시작해볼까요?
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                자료를 업로드하고 세션 목표를 설정하면 AI 코치가 맞춤 질문을
                준비합니다.
              </p>
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
                    onUpload={handleDocumentUpload}
                    onDelete={(_, label) => onToast(`${label} 삭제 완료`)}
                  />
                </section>

                <section className="relative z-20 rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                    <ClipboardList className="text-blue-600" size={20} />
                    <h3 className="text-base font-black text-slate-950">
                      세션 설정
                    </h3>
                  </div>
                  <SessionOptions mode={mode} onSelect={handleOptionSelect} />
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
                  onClick={handlePracticeStart}
                  disabled={!sessionId || isStartingSession}
                  className="flex min-h-12 items-center justify-between rounded-lg border border-blue-200 bg-blue-600 px-5 py-3 text-left text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-75"
                >
                  <span>
                    <span className="block text-md font-black">연습 시작</span>
                    <span className="block text-xs text-blue-100">
                      설정한 자료와 목표로 실시간 연습을 시작합니다.
                    </span>
                  </span>
                  {isStartingSession ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <ArrowRight size={24} />
                  )}
                </button>
              </aside>
            </div>

            {sessionOverlayVisible && (
              <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-white/50 backdrop-blur-[1px]">
                <button
                  type="button"
                  onClick={handleCreateSession}
                  disabled={isCreatingSession}
                  aria-busy={isCreatingSession}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-black text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-75"
                >
                  {isCreatingSession ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    '▶'
                  )}
                  세션 시작하기
                </button>
              </div>
            )}
          </div>

          <section className="rounded-lg border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <SessionSummary onNavigate={onNavigate} />
          </section>
        </div>
      </div>
    </>
  )
}
