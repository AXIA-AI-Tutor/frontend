'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, SkipForward, Square, X } from 'lucide-react'
import { LiveMetrics } from '@/components/live/LiveMetrics'
import { CoachAvatarLive } from '@/components/live/CoachAvatarLive'
import { TranscriptCard } from '@/components/live/TranscriptCard'
import { LiveHeader } from '@/components/live/LiveHeader'
import { LiveCameraGuide } from '@/components/live/LiveCameraGuide'
import {
  TurnFeedbackCard,
  type TurnFeedbackStatus,
} from '@/components/live/TurnFeedbackCard'
import { BottomNav } from '@/components/layout/BottomNav'
import { getLiveTurn } from '@/components/live/liveTurns'
import type { Screen } from '@/types'

interface LiveNavigationOptions {
  turnNumber?: number
}

interface LiveScreenProps {
  onNavigate: (screen: Screen, options?: LiveNavigationOptions) => void
  onToast: (msg: string) => void
  initialTurnNumber: number
}

const TOTAL_DURATION_SECONDS = 180

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatDuration(seconds: number) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

export function LiveScreen({
  onNavigate,
  onToast,
  initialTurnNumber,
}: LiveScreenProps) {
  const [seconds, setSeconds] = useState(0)
  const [eye, setEye] = useState(86)
  const [pose, setPose] = useState(8)
  const [isRecording, setIsRecording] = useState(false)
  const [showStartGuide, setShowStartGuide] = useState(true)
  const [turnNumber, setTurnNumber] = useState(initialTurnNumber)
  const [isAnswerLayout, setIsAnswerLayout] = useState(false)
  const [waveformResetSignal, setWaveformResetSignal] = useState(0)
  const [feedbackStatus, setFeedbackStatus] =
    useState<TurnFeedbackStatus>('ready')
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const secondsRef = useRef(0)
  const didReachLimitRef = useRef(false)

  const clearFeedbackTimer = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current)
      feedbackTimerRef.current = null
    }
  }, [])

  const requestFeedbackGeneration = useCallback(
    (completedTurn: number) => {
      clearFeedbackTimer()
      setFeedbackStatus('generating')
      feedbackTimerRef.current = setTimeout(() => {
        setFeedbackStatus('ready')
        onToast(`턴 ${completedTurn} 피드백이 준비되었습니다.`)
      }, 1600)
    },
    [clearFeedbackTimer, onToast]
  )

  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (!isRecording) return

      const nextSeconds = Math.min(
        secondsRef.current + 1,
        TOTAL_DURATION_SECONDS
      )

      secondsRef.current = nextSeconds
      setSeconds(nextSeconds)
      setEye(82 + Math.floor(Math.random() * 8))
      setPose(4 + Math.floor(Math.random() * 8))

      if (nextSeconds >= TOTAL_DURATION_SECONDS && !didReachLimitRef.current) {
        didReachLimitRef.current = true
        setIsRecording(false)
        requestFeedbackGeneration(turnNumber)
        onToast('제한 시간이 종료되었습니다.')
      }
    }, 1000)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [isRecording, onToast, requestFeedbackGeneration, turnNumber])

  useEffect(() => {
    return clearFeedbackTimer
  }, [clearFeedbackTimer])

  const timeStr = formatDuration(seconds)
  const totalDurationStr = formatDuration(TOTAL_DURATION_SECONDS)
  const turn = getLiveTurn(turnNumber)
  const { question, hint } = turn

  const handleStart = () => {
    secondsRef.current = 0
    didReachLimitRef.current = false
    setSeconds(0)
    setIsRecording(true)
    setIsAnswerLayout(true)
    setShowStartGuide(false)
    clearFeedbackTimer()
    setFeedbackStatus('in-progress')
    onToast('연습을 시작합니다.')
  }

  const handleStop = () => {
    setIsRecording(false)
    requestFeedbackGeneration(turnNumber)
    onToast('연습이 중지되었습니다.')
  }

  const handleRestart = () => {
    secondsRef.current = 0
    didReachLimitRef.current = false
    setSeconds(0)
    setIsRecording(true)
    setIsAnswerLayout(true)
    setShowStartGuide(false)
    clearFeedbackTimer()
    setFeedbackStatus('in-progress')
    setWaveformResetSignal((signal) => signal + 1)
    onToast('현재 질문을 다시 시작합니다.')
  }

  const handleNextTurn = () => {
    secondsRef.current = 0
    didReachLimitRef.current = false
    setTurnNumber((number) => number + 1)
    setSeconds(0)
    setIsRecording(false)
    setIsAnswerLayout(false)
    setShowStartGuide(false)
    clearFeedbackTimer()
    setFeedbackStatus('in-progress')
    setWaveformResetSignal((signal) => signal + 1)
    onToast('다음 질문을 준비합니다.')
  }

  const handleOpenFeedback = () => {
    onNavigate('feedback', { turnNumber })
  }

  const coachAvatarProps = {
    question,
    hint,
    onHintApply: () => onToast('힌트가 현재 답변 목표에 적용되었습니다.'),
  }

  const mobileCoachAvatar = (
    <CoachAvatarLive
      {...coachAvatarProps}
      featured={isAnswerLayout}
      compact={!isAnswerLayout}
    />
  )

  const desktopFeaturedCoachAvatar = (
    <CoachAvatarLive {...coachAvatarProps} featured fill />
  )

  const desktopSideCoachAvatar = (
    <CoachAvatarLive {...coachAvatarProps} expanded fill />
  )

  const mobileCamera = <LiveCameraGuide compact={isAnswerLayout} />

  const desktopControls = (
    <LiveControls
      iconOnly
      isRecording={isRecording}
      showStartGuide={showStartGuide}
      onDismissStartGuide={() => setShowStartGuide(false)}
      onStart={handleStart}
      onStop={handleStop}
      onRestart={handleRestart}
      onNext={handleNextTurn}
    />
  )

  const desktopCamera = (
    <LiveCameraGuide controls={desktopControls} fill compact={isAnswerLayout} />
  )

  const renderTurnFeedbackCard = () => (
    <TurnFeedbackCard
      status={feedbackStatus}
      turnNumber={turnNumber}
      onOpen={handleOpenFeedback}
    />
  )

  return (
    <>
      <div className="lg:hidden">
        <LiveHeader onNavigate={onNavigate} />

        {/* 콘텐츠 */}
        <div className="absolute inset-x-3.5 bottom-[70px] top-16 overflow-auto pb-3">
          <div className="mb-2.5 space-y-2.5">
            {isAnswerLayout ? (
              <>
                {mobileCoachAvatar}
                {mobileCamera}
              </>
            ) : (
              <>
                {mobileCamera}
                {mobileCoachAvatar}
              </>
            )}
          </div>
          {renderTurnFeedbackCard()}
          <LiveMetrics
            duration={timeStr}
            totalDuration={totalDurationStr}
            eyeContact={eye}
            posture={100 - pose * 3}
            isRecording={isRecording}
            currentTurn={turnNumber}
            waveformResetSignal={waveformResetSignal}
          />
          <TranscriptCard />

          <LiveControls
            isRecording={isRecording}
            showStartGuide={showStartGuide}
            onDismissStartGuide={() => setShowStartGuide(false)}
            onStart={handleStart}
            onStop={handleStop}
            onRestart={handleRestart}
            onNext={handleNextTurn}
          />
        </div>

        <BottomNav current="live" onNavigate={onNavigate} />
      </div>

      <div className="hidden lg:block">
        <div className="space-y-4">
          {/* <LiveHeader onNavigate={onNavigate} /> */}

          <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-4">
              <div className="h-[520px] xl:h-[560px] 2xl:h-[600px]">
                {isAnswerLayout ? desktopFeaturedCoachAvatar : desktopCamera}
              </div>
              <TranscriptCard />
            </div>

            <aside className="flex min-w-0 flex-col gap-4">
              <div className="h-[320px] xl:h-[340px] 2xl:h-[360px]">
                {isAnswerLayout ? desktopCamera : desktopSideCoachAvatar}
              </div>
              {renderTurnFeedbackCard()}
              <LiveMetrics
                duration={timeStr}
                totalDuration={totalDurationStr}
                eyeContact={eye}
                posture={100 - pose * 3}
                isRecording={isRecording}
                currentTurn={turnNumber}
                waveformResetSignal={waveformResetSignal}
              />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

interface LiveControlsProps {
  isRecording: boolean
  showStartGuide: boolean
  onStart: () => void
  onStop: () => void
  onRestart: () => void
  onNext: () => void
  onDismissStartGuide: () => void
  iconOnly?: boolean
}

function LiveControls({
  isRecording,
  showStartGuide,
  onStart,
  onStop,
  onRestart,
  onNext,
  onDismissStartGuide,
  iconOnly = false,
}: LiveControlsProps) {
  const handlePrimaryClick = () => {
    if (isRecording) {
      onStop()
      return
    }
    onStart()
  }

  if (iconOnly) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className={[
              'grid h-9 w-9 place-items-center rounded-lg border bg-white shadow-sm transition-colors',
              isRecording
                ? 'border-red-200 text-red-500 hover:bg-red-50'
                : 'border-blue-200 text-blue-600 hover:bg-blue-50',
            ].join(' ')}
            aria-label={isRecording ? '녹음 중지' : '연습 시작'}
            title={isRecording ? '녹음 중지' : '연습 시작'}
          >
            {isRecording ? (
              <Square size={14} fill="currentColor" />
            ) : (
              <Play size={15} fill="currentColor" />
            )}
          </button>
          <StartGuideBubble
            show={showStartGuide && !isRecording}
            onClose={onDismissStartGuide}
            className="right-0 top-[calc(100%+10px)]"
            arrow="top-right"
          />
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          aria-label="현재 질문 다시 시작"
          title="다시 시작"
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="grid h-9 w-9 place-items-center rounded-lg border border-blue-500 bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700"
          aria-label="다음 질문으로 이동"
          title="다음 질문"
        >
          <SkipForward size={15} />
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-[9px] lg:gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={handlePrimaryClick}
          className={[
            'inline-flex w-full items-center justify-center gap-1.5 rounded-lg border bg-white py-3 font-black shadow-sm transition-colors',
            isRecording
              ? 'border-red-200 text-red-500 hover:bg-red-50'
              : 'border-blue-200 text-blue-600 hover:bg-blue-50',
          ].join(' ')}
        >
          {isRecording ? (
            <Square size={14} fill="currentColor" />
          ) : (
            <Play size={15} fill="currentColor" />
          )}
          {isRecording ? '중지' : '시작'}
        </button>
        <StartGuideBubble
          show={false}
          onClose={onDismissStartGuide}
          className="bottom-[calc(100%+8px)] left-0"
          arrow="bottom-left"
        />
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-3 font-black text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
      >
        <RotateCcw size={15} />
        다시
      </button>
      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-500 bg-blue-600 py-3 font-black text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        <SkipForward size={15} />
        다음
      </button>
    </div>
  )
}

interface StartGuideBubbleProps {
  show: boolean
  onClose: () => void
  className?: string
  arrow: 'top-left' | 'top-right' | 'bottom-left'
}

function StartGuideBubble({
  show,
  onClose,
  className,
  arrow,
}: StartGuideBubbleProps) {
  if (!show) return null

  return (
    <div
      className={[
        'absolute z-30 w-[226px] rounded-lg border border-blue-100 bg-white px-3 py-2 text-left text-xs font-black leading-snug text-slate-700 shadow-lg',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className={[
          'absolute h-3 w-3 rotate-45 border-blue-100 bg-white',
          arrow === 'top-left'
            ? '-top-1.5 left-3 border-l border-t'
            : arrow === 'top-right'
              ? '-top-1.5 right-3 border-l border-t'
              : '-bottom-1.5 left-5 border-b border-r',
        ].join(' ')}
      />
      <div className="relative z-10 flex items-start gap-1">
        <span className="flex-1">이 버튼을 눌러 연습을 시작합니다.</span>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 -mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="시작 안내 닫기"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
