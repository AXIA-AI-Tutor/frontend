'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { FaceLandmarker } from '@mediapipe/tasks-vision'

const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm`
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
const SAMPLE_INTERVAL_MS = 100 // 10fps

export interface VisionScores {
  eyeContactScore: number
  postureScore: number
}

export interface VisionMetricsResult {
  currentEyeContact: number
  currentPosture: number
  getAverageScores: () => VisionScores
  resetSamples: () => void
}

const FALLBACK_SCORES: VisionScores = { eyeContactScore: 85, postureScore: 85 }

function calcScores(landmarks: { x: number; y: number }[]): VisionScores {
  const nose = landmarks[4] ?? { x: 0.5, y: 0.38 }

  // X: 좌우 이탈 패널티 — 10% 벗어나면 ~65점, 20% 벗어나면 ~30점
  const xOffset = Math.abs(nose.x - 0.5)

  // Y: 화면 상단 38% 기준, ±8% 허용 후 패널티 (아래를 보거나 너무 멀리 앉은 경우)
  const yIdeal = 0.38
  const yOffset = Math.max(0, Math.abs(nose.y - yIdeal) - 0.08)

  const eyeContactScore = Math.round(
    Math.max(0, 100 - xOffset * 350 - yOffset * 250)
  )

  // Posture: 좌우 눈 높이 차 기반 머리 기울기
  const leftEyeY = landmarks[263]?.y ?? 0
  const rightEyeY = landmarks[33]?.y ?? 0
  const eyeLevelDiff = Math.abs(leftEyeY - rightEyeY)
  const postureScore = Math.round(Math.max(0, 100 - eyeLevelDiff * 600))

  return { eyeContactScore, postureScore }
}

export function useVisionMetrics(
  videoRef: RefObject<HTMLVideoElement | null>,
  isActive: boolean
): VisionMetricsResult {
  const [currentEyeContact, setCurrentEyeContact] = useState(85)
  const [currentPosture, setCurrentPosture] = useState(85)

  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const samplesRef = useRef<VisionScores[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const loadingRef = useRef(false)

  const loadLandmarker = useCallback(async () => {
    if (loadingRef.current || landmarkerRef.current) return
    loadingRef.current = true

    try {
      const { FilesetResolver, FaceLandmarker } =
        await import('@mediapipe/tasks-vision')
      const vision = await FilesetResolver.forVisionTasks(WASM_URL)
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
      })
    } catch {
      // 모델 로드 실패 시 fallback 값으로 동작
    } finally {
      loadingRef.current = false
    }
  }, [])

  const processFrame = useCallback(() => {
    const video = videoRef.current
    const landmarker = landmarkerRef.current

    if (!video || !landmarker || video.readyState < 2) return

    try {
      const result = landmarker.detectForVideo(video, performance.now())
      const face = result.faceLandmarks?.[0]

      if (!face) {
        setCurrentEyeContact(0)
        samplesRef.current.push({ eyeContactScore: 0, postureScore: 50 })
        return
      }

      const scores = calcScores(face)
      setCurrentEyeContact(scores.eyeContactScore)
      setCurrentPosture(scores.postureScore)
      samplesRef.current.push(scores)
    } catch {
      // 프레임 처리 실패 시 스킵
    }
  }, [videoRef])

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    void loadLandmarker()
    intervalRef.current = setInterval(processFrame, SAMPLE_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, loadLandmarker, processFrame])

  useEffect(() => {
    return () => {
      landmarkerRef.current?.close()
      landmarkerRef.current = null
    }
  }, [])

  const getAverageScores = useCallback((): VisionScores => {
    const samples = samplesRef.current
    if (samples.length === 0) return FALLBACK_SCORES

    const sum = samples.reduce(
      (acc, s) => ({
        eyeContactScore: acc.eyeContactScore + s.eyeContactScore,
        postureScore: acc.postureScore + s.postureScore,
      }),
      { eyeContactScore: 0, postureScore: 0 }
    )

    return {
      eyeContactScore: Math.round(sum.eyeContactScore / samples.length),
      postureScore: Math.round(sum.postureScore / samples.length),
    }
  }, [])

  const resetSamples = useCallback(() => {
    samplesRef.current = []
    setCurrentEyeContact(85)
    setCurrentPosture(85)
  }, [])

  return { currentEyeContact, currentPosture, getAverageScores, resetSamples }
}
