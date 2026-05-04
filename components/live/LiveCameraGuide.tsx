'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Camera, CameraOff, Video } from 'lucide-react'

interface LiveCameraGuideProps {
  className?: string
  controls?: ReactNode
  compact?: boolean
}

type CameraStatus = 'idle' | 'ready' | 'blocked' | 'unsupported'

export function LiveCameraGuide({
  className,
  controls,
  compact = false,
}: LiveCameraGuideProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let stream: MediaStream | null = null
    let active = true

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        setStatus('ready')
      } catch {
        setStatus('blocked')
      }
    }

    startCamera()

    return () => {
      active = false
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [enabled])

  const handleCameraToggle = () => {
    setEnabled((value) => {
      const nextEnabled = !value
      if (!nextEnabled) setStatus('idle')
      return nextEnabled
    })
  }

  const showFallback = status !== 'ready'

  return (
    <section
      className={[
        'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm',
        compact ? 'h-[220px]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'relative z-10 flex items-center justify-between border-b border-slate-100 bg-white',
          compact ? 'px-3 py-2' : 'px-4 py-3',
        ].join(' ')}
      >
        <div>
          <h3 className="text-sm font-black text-slate-950">카메라 정렬</h3>
          {compact ? null : (
            <p className="mt-0.5 text-xs font-bold text-slate-400">
              얼굴과 어깨를 가이드 안에 맞춰주세요.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {controls}
          <button
            type="button"
            onClick={handleCameraToggle}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            aria-label={enabled ? '카메라 끄기' : '카메라 켜기'}
            title={enabled ? '카메라 끄기' : '카메라 켜기'}
          >
            {enabled ? <CameraOff size={16} /> : <Camera size={16} />}
          </button>
        </div>
      </div>

      <div
        className={[
          'relative overflow-hidden bg-slate-950',
          compact ? 'h-[166px]' : 'aspect-video',
        ].join(' ')}
      >
        <video
          ref={videoRef}
          className="h-full w-full scale-x-[-1] object-cover"
          muted
          playsInline
          autoPlay
        />

        {showFallback ? (
          <div className="absolute inset-0 grid place-items-center bg-slate-950 text-center text-white">
            <div>
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-lg bg-white/10">
                <Video size={24} />
              </div>
              <p className="text-sm font-black">
                {status === 'unsupported'
                  ? '이 브라우저는 카메라 접근을 지원하지 않습니다.'
                  : status === 'blocked'
                    ? '카메라 권한을 허용하면 미리보기가 표시됩니다.'
                    : '카메라를 준비하고 있습니다.'}
              </p>
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[12%] h-[42%] w-[24%] -translate-x-1/2 rounded-[44%] border-2 border-emerald-300/90 shadow-[0_0_0_999px_rgba(15,23,42,.14)]" />
          <div className="absolute bottom-[16%] left-1/2 h-[26%] w-[48%] -translate-x-1/2 rounded-t-[999px] border-2 border-dashed border-sky-300/90" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/25" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/20" />
        </div>

        <div className="absolute left-4 top-4 rounded-lg bg-slate-950/60 px-3 py-2 text-xs font-bold text-white backdrop-blur">
          머리는 초록 영역, 어깨는 점선 안쪽
        </div>
      </div>
    </section>
  )
}
