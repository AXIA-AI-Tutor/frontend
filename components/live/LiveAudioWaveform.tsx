'use client'

import { useEffect, useRef, useState } from 'react'

interface LiveAudioWaveformProps {
  isRecording: boolean
  resetSignal: number
  className?: string
}

type AudioStatus = 'idle' | 'requesting' | 'ready' | 'blocked' | 'unsupported'

const FFT_SIZE = 1024
const BAR_GAP = 3
const MIN_BAR_HEIGHT = 3
const SAMPLE_INTERVAL_MS = 45

export function LiveAudioWaveform({
  isRecording,
  resetSignal,
  className,
}: LiveAudioWaveformProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataRef = useRef<Float32Array<ArrayBuffer> | null>(null)
  const historyRef = useRef<number[]>([])
  const recordingRef = useRef(isRecording)
  const lastSampleAtRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<AudioStatus>('idle')

  useEffect(() => {
    recordingRef.current = isRecording
  }, [isRecording])

  useEffect(() => {
    historyRef.current = []
    lastSampleAtRef.current = 0
  }, [resetSignal])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
    })

    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return

    let audioContext: AudioContext | null = null
    let stream: MediaStream | null = null
    let active = true

    async function startAudio() {
      if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
        setStatus('unsupported')
        return
      }

      try {
        setStatus('requesting')
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        })

        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = FFT_SIZE
        analyser.smoothingTimeConstant = 0.78
        source.connect(analyser)
        analyserRef.current = analyser
        dataRef.current = new Float32Array(analyser.fftSize)
        setStatus('ready')
      } catch {
        setStatus('blocked')
      }
    }

    startAudio()

    return () => {
      active = false
      analyserRef.current = null
      dataRef.current = null
      stream?.getTracks().forEach((track) => track.stop())
      void audioContext?.close()
    }
  }, [visible])

  useEffect(() => {
    if (status !== 'ready') return

    const canvas = canvasRef.current
    const analyser = analyserRef.current
    const data = dataRef.current
    if (!canvas || !analyser || !data) return

    const context = canvas.getContext('2d')
    if (!context) return

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect()
      const pixelRatio = window.devicePixelRatio || 1
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      const canvasWidth = Math.floor(width * pixelRatio)
      const canvasHeight = Math.floor(height * pixelRatio)

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth
        canvas.height = canvasHeight
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      analyser.getFloatTimeDomainData(data)

      const amplitude = getAmplitude(data)
      if (
        recordingRef.current &&
        now - lastSampleAtRef.current >= SAMPLE_INTERVAL_MS
      ) {
        const maxBars = Math.max(24, Math.floor(width / (BAR_GAP + 2)))
        historyRef.current = [...historyRef.current, amplitude].slice(-maxBars)
        lastSampleAtRef.current = now
      }

      drawBackground(context, width, height)
      if (recordingRef.current) {
        drawRecordedBars(context, historyRef.current, width, height)
      } else {
        drawLiveWave(context, data, width, height)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [status])

  return (
    <div
      ref={rootRef}
      className={[
        'relative h-9 overflow-hidden rounded-lg bg-slate-50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {status !== 'ready' ? (
        <div className="absolute inset-0 grid place-items-center text-[11px] font-bold text-slate-400">
          {status === 'blocked'
            ? '마이크 권한이 필요합니다.'
            : status === 'unsupported'
              ? '마이크 파형을 지원하지 않는 브라우저입니다.'
              : '음성 파형 준비 중'}
        </div>
      ) : null}
    </div>
  )
}

function getAmplitude(data: ArrayLike<number>) {
  let sum = 0
  for (let index = 0; index < data.length; index += 1) {
    const sample = data[index] ?? 0
    sum += sample * sample
  }
  return Math.min(1, Math.sqrt(sum / data.length) * 6)
}

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#f8fafc'
  context.fillRect(0, 0, width, height)
  context.strokeStyle = '#e2e8f0'
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(0, height / 2)
  context.lineTo(width, height / 2)
  context.stroke()
}

function drawRecordedBars(
  context: CanvasRenderingContext2D,
  history: number[],
  width: number,
  height: number
) {
  const barWidth = Math.max(2, width / Math.max(history.length, 48) - BAR_GAP)
  const step = barWidth + BAR_GAP
  const startX =
    history.length * step > width ? width - history.length * step : 0
  const gradient = context.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, '#60a5fa')
  gradient.addColorStop(0.55, '#3b82f6')
  gradient.addColorStop(1, '#8b5cf6')
  context.fillStyle = gradient

  history.forEach((amplitude, index) => {
    const x = startX + index * step
    const barHeight = Math.max(MIN_BAR_HEIGHT, amplitude * height * 0.88)
    const y = (height - barHeight) / 2
    roundRect(context, x, y, barWidth, barHeight, 99)
    context.fill()
  })
}

function drawLiveWave(
  context: CanvasRenderingContext2D,
  data: ArrayLike<number>,
  width: number,
  height: number
) {
  const gradient = context.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, '#38bdf8')
  gradient.addColorStop(1, '#8b5cf6')
  context.strokeStyle = gradient
  context.lineWidth = 2
  context.beginPath()

  const step = Math.ceil(data.length / Math.max(48, Math.floor(width / 4)))
  let x = 0
  let started = false

  for (let index = 0; index < data.length; index += step) {
    const sample = data[index] ?? 0
    const y = height / 2 + sample * height * 0.42

    if (!started) {
      context.moveTo(x, y)
      started = true
    } else {
      context.lineTo(x, y)
    }

    x += width / (data.length / step)
  }

  context.stroke()
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const nextRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + nextRadius, y)
  context.arcTo(x + width, y, x + width, y + height, nextRadius)
  context.arcTo(x + width, y + height, x, y + height, nextRadius)
  context.arcTo(x, y + height, x, y, nextRadius)
  context.arcTo(x, y, x + width, y, nextRadius)
  context.closePath()
}
