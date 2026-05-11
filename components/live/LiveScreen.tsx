'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, SkipForward, Square, X } from 'lucide-react'
import { LiveMetrics } from '@/components/live/LiveMetrics'
import { CoachAvatarLive } from '@/components/live/CoachAvatarLive'
import { LiveHeader } from '@/components/live/LiveHeader'
import { LiveCameraGuide } from '@/components/live/LiveCameraGuide'
import {
  TurnFeedbackCard,
  type TurnFeedbackStatus,
} from '@/components/live/TurnFeedbackCard'
import { AILoadingOverlay } from '@/components/ui/AILoadingOverlay'
import { BottomNav } from '@/components/layout/BottomNav'
import { FeedbackScreen } from '@/components/feedback/FeedbackScreen'
import { getApiErrorMessage } from '@/lib/api/client'
import { submitAnswerWithFeedback } from '@/lib/api/answers'
import { generateSessionReport } from '@/lib/api/reports'
import { completeSession, nextQuestion } from '@/lib/api/sessions'
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder'
import { useVisionMetrics } from '@/lib/hooks/useVisionMetrics'
import {
  isPracticeSessionActive,
  usePracticeSessionStore,
} from '@/lib/stores/practiceSession'
import { useAvatarStore } from '@/lib/stores/avatar'
import { useTurnFeedbackStore } from '@/lib/stores/turnFeedback'
import { canUseBrowserSpeech, getAvatarSpeechVoice } from '@/lib/tts/speech'
import type { Screen } from '@/types'
import type { AiQuestionGenerateResponse } from '@/types/session'

interface LiveNavigationOptions {
  turnNumber?: number
  sessionId?: number
}

interface LiveScreenProps {
  onNavigate: (screen: Screen, options?: LiveNavigationOptions) => void
  onToast: (msg: string) => void
  initialTurnNumber: number
  sessionId?: number
  answerTimeLimitSec?: number // 백엔드: SessionResponse.answerTimeLimitSec
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatDuration(seconds: number) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

function formatLocalDateTime(date: Date) {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000

  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 19)
}

function getQuestionText(question: AiQuestionGenerateResponse | null) {
  return question?.question_text || null
}

function getQuestionIntent(question: AiQuestionGenerateResponse | null) {
  return question?.question_intent || null
}

export function LiveScreen({
  onNavigate,
  onToast,
  initialTurnNumber,
  sessionId,
  answerTimeLimitSec = 120,
}: LiveScreenProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [showStartGuide, setShowStartGuide] = useState(true)
  const [turnNumber, setTurnNumber] = useState(initialTurnNumber)
  const [isAnswerLayout, setIsAnswerLayout] = useState(false)
  const [isPreparingAnswer, setIsPreparingAnswer] = useState(false)
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false)
  const [isStartingAnswer, setIsStartingAnswer] = useState(false)
  const [isSpeakingFeedbackSummary, setIsSpeakingFeedbackSummary] =
    useState(false)
  const [currentSpeechType, setCurrentSpeechType] = useState<
    'question' | 'feedback' | null
  >(null)
  const [waveformResetSignal, setWaveformResetSignal] = useState(0)
  const [feedbackStatus, setFeedbackStatus] =
    useState<TurnFeedbackStatus>('ready-to-start')
  const sessionStart = usePracticeSessionStore((state) => state.sessionStart)
  const questionByTurn = usePracticeSessionStore(
    (state) => state.questionByTurn
  )
  const maxQuestionCount = usePracticeSessionStore(
    (state) => state.maxQuestionCount
  )
  const setTurnQuestion = usePracticeSessionStore(
    (state) => state.setTurnQuestion
  )
  const resetPracticeSession = usePracticeSessionStore(
    (state) => state.resetPracticeSession
  )
  const {
    startRecording,
    stopRecording,
    reset: resetAudioRecorder,
  } = useAudioRecorder()
  const setTurnFeedback = useTurnFeedbackStore((state) => state.setTurnFeedback)
  const clearTurnFeedback = useTurnFeedbackStore((state) => state.clear)
  const turnFeedbackByTurn = useTurnFeedbackStore((state) => state.byTurn)
  const avatarGender = useAvatarStore((state) => state.gender)
  const preferredVoiceNames = useAvatarStore(
    (state) => state.preferredVoiceNames
  )
  const cameraVideoRef = useRef<HTMLVideoElement>(null)
  const { currentEyeContact, currentPosture, getAverageScores, resetSamples } =
    useVisionMetrics(cameraVideoRef, isRecording)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const secondsRef = useRef(0)
  const didReachLimitRef = useRef(false)
  const didWarnLongAnswerRef = useRef(false)
  const startedAtRef = useRef<Date | null>(null)
  const isSubmittingRef = useRef(false)
  const isSpeakingQuestionRef = useRef(false)
  const isSpeakingFeedbackSummaryRef = useRef(false)
  const isStartingAnswerRef = useRef(false)
  const isUnmountedRef = useRef(false)

  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)

  const activeSessionStart =
    sessionStart && sessionStart.session.id === sessionId ? sessionStart : null
  const sessionQuestion =
    turnNumber === 1 && activeSessionStart
      ? activeSessionStart.question
      : (questionByTurn[turnNumber] ?? null)
  const question = getQuestionText(sessionQuestion)
  const hint = getQuestionIntent(sessionQuestion)
  const isLastTurn = maxQuestionCount > 0 && turnNumber === maxQuestionCount
  const effectiveAnswerTimeLimitSec =
    activeSessionStart?.session.answerTimeLimitSec ?? answerTimeLimitSec
  const timeStr = formatDuration(seconds)
  const totalDurationStr = formatDuration(effectiveAnswerTimeLimitSec)
  const isSubmittingFeedback = feedbackStatus === 'generating'
  // 피드백 후 복귀 시 store에 해당 턴 데이터가 있으면 이미 답변 완료로 간주해 재제출 방지
  const isCurrentTurnAnswered =
    feedbackStatus === 'ready' || !!turnFeedbackByTurn[turnNumber]
  const effectiveFeedbackStatus: TurnFeedbackStatus = isCurrentTurnAnswered
    ? 'ready'
    : feedbackStatus
  const isPrimaryControlDisabled =
    isPreparingAnswer ||
    isSpeakingQuestion ||
    isStartingAnswer ||
    isSubmittingFeedback ||
    isCurrentTurnAnswered
  const isNextControlDisabled =
    isSubmittingFeedback ||
    isSpeakingFeedbackSummary ||
    isRecording ||
    !isCurrentTurnAnswered
  const isAnswerView = isAnswerLayout || isPreparingAnswer

  const finishFeedbackSummarySpeech = useCallback(() => {
    isSpeakingFeedbackSummaryRef.current = false

    if (isUnmountedRef.current) {
      return
    }

    setIsSpeakingFeedbackSummary(false)
    setCurrentSpeechType(null)
  }, [])

  const startFeedbackSummarySpeech = useCallback(
    (summary: string | null | undefined) => {
      const feedbackSummary = summary?.trim()

      if (!feedbackSummary || !canUseBrowserSpeech()) {
        return
      }

      isSpeakingFeedbackSummaryRef.current = true

      if (!isUnmountedRef.current) {
        setIsSpeakingFeedbackSummary(true)
        setCurrentSpeechType('feedback')
      }

      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          if (isUnmountedRef.current) {
            return
          }

          if (!canUseBrowserSpeech()) {
            finishFeedbackSummarySpeech()
            return
          }

          const speechSynthesis = window.speechSynthesis
          const utterance = new SpeechSynthesisUtterance(feedbackSummary)

          utterance.lang = 'ko-KR'
          utterance.voice = getAvatarSpeechVoice(speechSynthesis, {
            gender: avatarGender,
            preferredVoiceNames,
          })
          utterance.onend = finishFeedbackSummarySpeech
          utterance.onerror = finishFeedbackSummarySpeech

          speechSynthesis.cancel()
          speechSynthesis.resume()

          try {
            speechSynthesis.speak(utterance)
            speechSynthesis.resume()
          } catch {
            finishFeedbackSummarySpeech()
          }
        }, 0)
      })
    },
    [avatarGender, finishFeedbackSummarySpeech, preferredVoiceNames]
  )

  const finishAnswer = useCallback(
    async (reason: 'manual' | 'timeout') => {
      if (isSubmittingRef.current) {
        return
      }

      isSubmittingRef.current = true
      setIsRecording(false)
      setFeedbackStatus('generating')

      try {
        const recording = await stopRecording()
        const endedAt = new Date()
        const startedAt = startedAtRef.current ?? endedAt
        const { eyeContactScore, postureScore } = getAverageScores()

        // TODO(KAN-66): 백엔드 연동 확인 후 제거한다.
        // eslint-disable-next-line no-console
        console.log('[KAN-66] POST answers/with-feedback request', {
          sessionId,
          reason,
          questionText: question,
          file: {
            name: recording.file.name,
            type: recording.file.type,
            size: recording.file.size,
          },
          eyeContactScore,
          postureScore,
          startedAt: formatLocalDateTime(startedAt),
          endedAt: formatLocalDateTime(endedAt),
        })

        if (!sessionId) {
          onToast('세션 ID가 없어 피드백을 요청하지 못했습니다.')
          setFeedbackStatus('ready-to-start')
          return
        }

        if (!question) {
          onToast('질문 정보를 불러오지 못했습니다. 홈에서 다시 시작해 주세요.')
          setFeedbackStatus('ready-to-start')
          return
        }

        if (recording.size <= 0) {
          throw new Error('녹음 파일이 비어 있습니다.')
        }

        const response = await submitAnswerWithFeedback(sessionId, {
          questionText: question,
          file: recording.file,
          eyeContactScore,
          postureScore,
          startedAt: formatLocalDateTime(startedAt),
          endedAt: formatLocalDateTime(endedAt),
        })

        // TODO(KAN-66): 백엔드 연동 확인 후 제거한다.
        // eslint-disable-next-line no-console
        console.log('[KAN-66] POST answers/with-feedback response', response)

        setTurnFeedback(turnNumber, {
          questionText: question, // null guard above ensures question is string here
          questionIntent: hint,
          response,
        })
        setFeedbackStatus('ready')
        startFeedbackSummarySpeech(response.feedback.summary)

        if (isLastTurn) {
          try {
            if (sessionId) {
              await completeSession(sessionId)
              // 리포트 생성은 AI 처리 시간이 걸리므로 응답을 기다리지 않는다.
              void generateSessionReport(sessionId).catch((error) => {
                // eslint-disable-next-line no-console
                console.error('[KAN-201] report generation failed', error)
                onToast(
                  '리포트 생성이 지연되고 있습니다. 리포트 목록에서 다시 확인해 주세요.'
                )
              })
            }
          } catch {
            // 세션 완료 실패해도 답변 제출은 성공이므로 모달은 표시한다.
          }
          setShowCompletionModal(true)
          return
        }

        onToast(`질문 ${turnNumber} 피드백이 생성되었습니다.`)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[KAN-66] POST answers/with-feedback failed', error)

        const message = getApiErrorMessage(
          error,
          '피드백 생성을 요청하지 못했습니다.'
        )

        setFeedbackStatus('ready-to-start')
        onToast(message)
      } finally {
        isSubmittingRef.current = false
        startedAtRef.current = null
        resetAudioRecorder()
        resetSamples()
      }
    },
    [
      getAverageScores,
      hint,
      isLastTurn,
      onToast,
      question,
      resetAudioRecorder,
      resetSamples,
      sessionId,
      setTurnFeedback,
      startFeedbackSummarySpeech,
      stopRecording,
      turnNumber,
    ]
  )

  useEffect(() => {
    tickRef.current = setInterval(() => {
      if (!isRecording) return

      const nextSeconds = Math.min(
        secondsRef.current + 1,
        effectiveAnswerTimeLimitSec
      )

      secondsRef.current = nextSeconds
      setSeconds(nextSeconds)

      const warningThreshold = Math.floor(effectiveAnswerTimeLimitSec * 0.75)
      if (
        nextSeconds >= warningThreshold &&
        !didWarnLongAnswerRef.current &&
        !didReachLimitRef.current
      ) {
        didWarnLongAnswerRef.current = true
        onToast('답변이 길어지고 있어요. 곧 마무리해 주세요.')
      }

      if (
        nextSeconds >= effectiveAnswerTimeLimitSec &&
        !didReachLimitRef.current
      ) {
        didReachLimitRef.current = true
        void finishAnswer('timeout')
        onToast('제한 시간이 종료되었습니다.')
      }
    }, 1000)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [effectiveAnswerTimeLimitSec, finishAnswer, isRecording, onToast])

  useEffect(() => {
    return () => {
      resetAudioRecorder()
    }
  }, [resetAudioRecorder])

  useEffect(() => {
    isUnmountedRef.current = false

    return () => {
      isUnmountedRef.current = true
      isSpeakingQuestionRef.current = false
      isSpeakingFeedbackSummaryRef.current = false
      isStartingAnswerRef.current = false

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleStart = useCallback(async () => {
    if (isSubmittingRef.current) {
      return
    }

    if (isCurrentTurnAnswered) {
      onToast('이미 제출한 답변입니다. 다음 질문으로 넘어가 주세요.')
      return
    }

    try {
      await startRecording()
      startedAtRef.current = new Date()
      secondsRef.current = 0
      didReachLimitRef.current = false
      didWarnLongAnswerRef.current = false
      setSeconds(0)
      setIsRecording(true)
      setIsAnswerLayout(true)
      setShowStartGuide(false)
      setFeedbackStatus('in-progress')
      onToast('연습을 시작합니다.')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '녹음을 시작하지 못했습니다.'

      onToast(message)
    }
  }, [isCurrentTurnAnswered, onToast, startRecording])

  const handleStartWithTts = useCallback(() => {
    const questionText = question?.trim()

    if (isSpeakingQuestionRef.current || isStartingAnswerRef.current) {
      return
    }

    const startAnswer = async () => {
      if (isUnmountedRef.current || isStartingAnswerRef.current) {
        return
      }

      isStartingAnswerRef.current = true

      if (!isUnmountedRef.current) {
        setIsStartingAnswer(true)
      }

      try {
        await handleStart()
      } finally {
        isStartingAnswerRef.current = false

        if (!isUnmountedRef.current) {
          setIsPreparingAnswer(false)
          setIsStartingAnswer(false)
        }
      }
    }

    const runAfterPreparingScreenPaint = (callback: () => void) => {
      if (!isUnmountedRef.current) {
        setIsPreparingAnswer(true)
      }

      if (typeof window === 'undefined') {
        callback()
        return
      }

      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          if (isUnmountedRef.current) {
            return
          }

          callback()
        }, 0)
      })
    }

    if (!questionText || !canUseBrowserSpeech()) {
      runAfterPreparingScreenPaint(() => {
        void startAnswer()
      })
      return
    }

    isSpeakingQuestionRef.current = true

    if (!isUnmountedRef.current) {
      setIsPreparingAnswer(true)
      setIsSpeakingQuestion(true)
      setCurrentSpeechType('question')
    }

    runAfterPreparingScreenPaint(() => {
      const utterance = new SpeechSynthesisUtterance(questionText)
      let didStartRecording = false
      const speechSynthesis = window.speechSynthesis

      const startAfterSpeech = () => {
        if (didStartRecording || isUnmountedRef.current) {
          return
        }

        didStartRecording = true
        isSpeakingQuestionRef.current = false

        if (!isUnmountedRef.current) {
          setIsSpeakingQuestion(false)
          setCurrentSpeechType(null)
        }

        void startAnswer()
      }

      utterance.lang = 'ko-KR'
      utterance.voice = getAvatarSpeechVoice(speechSynthesis, {
        gender: avatarGender,
        preferredVoiceNames,
      })
      utterance.onend = startAfterSpeech
      utterance.onerror = startAfterSpeech

      speechSynthesis.cancel()
      speechSynthesis.resume()

      window.setTimeout(() => {
        if (didStartRecording || isUnmountedRef.current) {
          return
        }

        try {
          speechSynthesis.speak(utterance)
          speechSynthesis.resume()
        } catch {
          startAfterSpeech()
        }
      }, 100)
    })
  }, [avatarGender, handleStart, preferredVoiceNames, question])

  const handleStop = () => {
    void finishAnswer('manual')
    onToast('답변이 완료되었습니다.')
  }

  const handleNextTurn = async () => {
    if (isSpeakingFeedbackSummary) {
      return
    }

    if (isRecording || isSubmittingRef.current) {
      onToast('진행 중인 답변을 먼저 완료해 주세요.')
      return
    }

    if (!isCurrentTurnAnswered) {
      onToast('현재 질문의 답변을 먼저 완료해 주세요.')
      return
    }

    if (isLastTurn) {
      onToast('마지막 질문입니다.')
      return
    }

    let nextQuestionIndex: number

    if (sessionId) {
      try {
        const res = await nextQuestion(sessionId)
        nextQuestionIndex = res.questionIndex

        if (
          nextQuestionIndex <= turnNumber ||
          nextQuestionIndex > res.maxQuestionCount
        ) {
          onToast('다음 질문 정보를 확인하지 못했습니다.')
          return
        }

        setTurnQuestion(nextQuestionIndex, res.question, res.maxQuestionCount)
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          '다음 질문을 불러오지 못했습니다.'
        )
        onToast(message)
        return
      }
    } else {
      onToast(
        '현재 연습 정보를 확인하지 못했습니다. 홈에서 다시 시작해 주세요.'
      )
      return
    }

    secondsRef.current = 0
    didReachLimitRef.current = false
    setTurnNumber(nextQuestionIndex)
    setSeconds(0)
    setIsRecording(false)
    setIsAnswerLayout(false)
    setShowStartGuide(false)
    setFeedbackStatus('ready-to-start')
    setWaveformResetSignal((signal) => signal + 1)
    onToast('다음 질문을 준비합니다.')
  }

  const handleOpenFeedback = () => {
    if (isSpeakingFeedbackSummary) {
      return
    }

    setFeedbackModalOpen(true)
  }

  const handleModalNavigate = useCallback(
    (screen: Screen, options?: LiveNavigationOptions) => {
      setFeedbackModalOpen(false)
      if (screen === 'live' && options?.turnNumber !== undefined) {
        setTurnNumber(options.turnNumber)
        setSeconds(0)
        setIsRecording(false)
        setIsAnswerLayout(false)
        setShowStartGuide(false)
        setFeedbackStatus('ready-to-start')
        setWaveformResetSignal((prev) => prev + 1)
      }
    },
    []
  )

  const coachAvatarProps = {
    question:
      question ?? '질문 정보를 불러오지 못했습니다. 홈에서 다시 시작해 주세요.',
    hint: hint ?? '',
    summary:
      turnFeedbackByTurn[turnNumber]?.response?.feedback?.summary ?? null,
    speechType: currentSpeechType,
  }

  const mobileCoachAvatar = (
    <CoachAvatarLive
      {...coachAvatarProps}
      featured={isAnswerView}
      compact={!isAnswerView}
    />
  )

  const desktopFeaturedCoachAvatar = (
    <CoachAvatarLive {...coachAvatarProps} featured fill />
  )

  const desktopSideCoachAvatar = (
    <CoachAvatarLive {...coachAvatarProps} expanded fill />
  )

  const mobileCamera = (
    <LiveCameraGuide ref={cameraVideoRef} compact={isAnswerView} />
  )

  const desktopPracticeControls = (
    <LiveControls
      isRecording={isRecording}
      showStartGuide={showStartGuide}
      onDismissStartGuide={() => setShowStartGuide(false)}
      onStart={handleStartWithTts}
      onStop={handleStop}
      onNext={handleNextTurn}
      primaryDisabled={isPrimaryControlDisabled}
      nextDisabled={isNextControlDisabled}
    />
  )

  const desktopCamera = (
    <LiveCameraGuide ref={cameraVideoRef} fill compact={isAnswerView} />
  )

  const renderTurnFeedbackCard = () => (
    <TurnFeedbackCard
      status={effectiveFeedbackStatus}
      turnNumber={turnNumber}
      onOpen={handleOpenFeedback}
      disabled={isSpeakingFeedbackSummary}
    />
  )

  const currentFeedbackEntry = turnFeedbackByTurn[turnNumber]

  const FEEDBACK_LOADING_MESSAGES = [
    'AI 코치가 답변을 분석하고 있어요...',
    '음성과 전달력을 살펴보는 중이에요...',
    '피드백을 작성하고 있어요...',
    '거의 다 됐어요, 잠시만 기다려 주세요!',
  ]

  return (
    <>
      {isSubmittingFeedback && (
        <AILoadingOverlay messages={FEEDBACK_LOADING_MESSAGES} />
      )}
      {feedbackModalOpen && currentFeedbackEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="relative h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md transition-colors hover:bg-white"
              aria-label="피드백 닫기"
            >
              <X size={16} />
            </button>
            <FeedbackScreen
              turnNumber={turnNumber}
              sessionId={sessionId}
              answerId={currentFeedbackEntry.response.answer.answerId}
              turn={{
                question: currentFeedbackEntry.questionText,
                hint: currentFeedbackEntry.questionIntent ?? '',
                topic:
                  currentFeedbackEntry.questionText.length > 16
                    ? currentFeedbackEntry.questionText.slice(0, 16) + '…'
                    : currentFeedbackEntry.questionText,
              }}
              feedback={{
                feedbackId: currentFeedbackEntry.response.feedback.feedbackId,
                answerId: currentFeedbackEntry.response.feedback.answerId,
                createdAt: currentFeedbackEntry.response.feedback.createdAt,
                answer: currentFeedbackEntry.response.answer.transcript,
                summary: currentFeedbackEntry.response.feedback.summary,
                evidence: currentFeedbackEntry.response.feedback.evidence,
                improvedExample:
                  currentFeedbackEntry.response.feedback.improvementExample,
                scores: [
                  {
                    label: '논리성',
                    score:
                      currentFeedbackEntry.response.feedback.structureScore,
                  },
                  {
                    label: '구체성',
                    score:
                      currentFeedbackEntry.response.feedback.specificityScore,
                  },
                  {
                    label: '관련성',
                    score:
                      currentFeedbackEntry.response.feedback.relevanceScore,
                  },
                  {
                    label: '전달력',
                    score: currentFeedbackEntry.response.feedback.deliveryScore,
                  },
                ],
              }}
              feedbackSource="live"
              embedded
              onNavigate={handleModalNavigate}
              onToast={onToast}
            />
          </div>
        </div>
      )}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-3xl">
              🎉
            </div>
            <h2 className="text-lg font-black text-slate-950">
              세션이 완료되었습니다
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              모든 질문에 답변했습니다.
              <br />
              리포트에서 종합 피드백을 확인하세요.
            </p>
            <button
              type="button"
              onClick={() => {
                resetPracticeSession()
                clearTurnFeedback()
                onNavigate('home')
              }}
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-black text-white transition-colors hover:bg-blue-700"
            >
              홈으로
            </button>
          </div>
        </div>
      )}

      <div className="lg:hidden">
        <LiveHeader onNavigate={onNavigate} />

        {/* 콘텐츠 */}
        <div className="absolute inset-x-3.5 bottom-[70px] top-16 overflow-auto pb-3">
          <div className="mb-2.5 space-y-2.5">
            {isAnswerView ? (
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
            eyeContact={currentEyeContact}
            posture={currentPosture}
            isRecording={isRecording}
            currentTurn={turnNumber}
            waveformResetSignal={waveformResetSignal}
          />
          <LiveControls
            isRecording={isRecording}
            showStartGuide={showStartGuide}
            onDismissStartGuide={() => setShowStartGuide(false)}
            onStart={handleStartWithTts}
            onStop={handleStop}
            onNext={handleNextTurn}
            primaryDisabled={isPrimaryControlDisabled}
            nextDisabled={isNextControlDisabled}
          />
        </div>

        <BottomNav
          current="live"
          onNavigate={onNavigate}
          disabledScreens={
            isPracticeSessionActive(sessionStart) ? [] : ['live']
          }
        />
      </div>

      <div className="hidden lg:block">
        <div className="space-y-4">
          {/* <LiveHeader onNavigate={onNavigate} /> */}

          <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-4">
              <div className="h-[520px] xl:h-[560px] 2xl:h-[600px]">
                {isAnswerView ? desktopFeaturedCoachAvatar : desktopCamera}
              </div>
              {desktopPracticeControls}
            </div>

            <aside className="flex min-w-0 flex-col gap-4">
              <div className="h-[320px] xl:h-[340px] 2xl:h-[360px]">
                {isAnswerView ? desktopCamera : desktopSideCoachAvatar}
              </div>
              {renderTurnFeedbackCard()}
              <LiveMetrics
                duration={timeStr}
                totalDuration={totalDurationStr}
                eyeContact={currentEyeContact}
                posture={currentPosture}
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
  onNext: () => void
  onDismissStartGuide: () => void
  iconOnly?: boolean
  disabled?: boolean
  primaryDisabled?: boolean
  nextDisabled?: boolean
}

function LiveControls({
  isRecording,
  showStartGuide,
  onStart,
  onStop,
  onNext,
  onDismissStartGuide,
  iconOnly = false,
  disabled = false,
  primaryDisabled = false,
  nextDisabled = false,
}: LiveControlsProps) {
  const isPrimaryDisabled = disabled || primaryDisabled
  const isNextDisabled = disabled || nextDisabled

  const handlePrimaryClick = () => {
    if (isPrimaryDisabled) {
      return
    }

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
            disabled={isPrimaryDisabled}
            className={[
              'grid h-9 w-9 place-items-center rounded-lg border bg-white shadow-sm transition-colors',
              isRecording
                ? 'border-red-200 text-red-500 hover:bg-red-50'
                : 'border-blue-200 text-blue-600 hover:bg-blue-50',
              isPrimaryDisabled ? 'cursor-not-allowed opacity-60' : '',
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
            show={showStartGuide && !isRecording && !isPrimaryDisabled}
            onClose={onDismissStartGuide}
            className="right-0 top-[calc(100%+10px)]"
            arrow="top-right"
          />
        </div>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="grid h-9 w-9 place-items-center rounded-lg border border-blue-500 bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="다음 질문으로 이동"
          title="다음 질문"
        >
          <SkipForward size={15} />
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-[9px] lg:gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={handlePrimaryClick}
          disabled={isPrimaryDisabled}
          className={[
            'inline-flex w-full items-center justify-center gap-1.5 rounded-lg border bg-white py-3 font-black shadow-sm transition-colors',
            isRecording
              ? 'border-red-200 text-red-500 hover:bg-red-50'
              : 'border-blue-200 text-blue-600 hover:bg-blue-50',
            isPrimaryDisabled ? 'cursor-not-allowed opacity-60' : '',
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
        onClick={onNext}
        disabled={isNextDisabled}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-500 bg-blue-600 py-3 font-black text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
