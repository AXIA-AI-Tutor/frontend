import { useCallback, useEffect, useRef, useState } from 'react'

export type AudioRecorderStatus =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'ready'
  | 'blocked'
  | 'unsupported'
  | 'error'

export interface AudioRecordingResult {
  blob: Blob
  file: File
  mimeType: string
  size: number
}

const AUDIO_MIME_TYPE_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/wav',
]

function getSupportedMimeType() {
  if (typeof window === 'undefined' || !('MediaRecorder' in window)) {
    return null
  }

  return (
    AUDIO_MIME_TYPE_CANDIDATES.find((type) =>
      window.MediaRecorder.isTypeSupported(type)
    ) ?? ''
  )
}

function getFileExtension(mimeType: string) {
  if (mimeType.includes('mp4')) return 'm4a'
  if (mimeType.includes('ogg')) return 'ogg'
  if (mimeType.includes('wav')) return 'wav'
  return 'webm'
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop())
}

export function useAudioRecorder() {
  const [status, setStatus] = useState<AudioRecorderStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mimeTypeRef = useRef('')

  const cleanup = useCallback(() => {
    stopStream(streamRef.current)
    streamRef.current = null
    mediaRecorderRef.current = null
    chunksRef.current = []
    mimeTypeRef.current = ''
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const reset = useCallback(() => {
    cleanup()
    setErrorMessage(null)
    setStatus('idle')
  }, [cleanup])

  const startRecording = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof window === 'undefined' ||
      !('MediaRecorder' in window)
    ) {
      setStatus('unsupported')
      throw new Error('이 브라우저는 음성 녹음을 지원하지 않습니다.')
    }

    const mimeType = getSupportedMimeType()

    if (mimeType === null) {
      setStatus('unsupported')
      throw new Error('이 브라우저는 음성 녹음을 지원하지 않습니다.')
    }

    cleanup()
    setStatus('requesting')
    setErrorMessage(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 32_000, // 32kbps — 음성 STT에 충분, 2분 기준 ~480KB
      })

      chunksRef.current = []
      streamRef.current = stream
      mediaRecorderRef.current = recorder
      mimeTypeRef.current = mimeType || recorder.mimeType

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.start()
      setStatus('recording')
    } catch (error) {
      cleanup()

      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setStatus('blocked')
        setErrorMessage('마이크 권한이 필요합니다.')
        throw new Error('마이크 권한이 필요합니다.')
      }

      setStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : '녹음을 시작하지 못했습니다.'
      )
      throw error
    }
  }, [cleanup])

  const stopRecording = useCallback(() => {
    return new Promise<AudioRecordingResult>((resolve, reject) => {
      const recorder = mediaRecorderRef.current

      if (!recorder || recorder.state === 'inactive') {
        reject(new Error('진행 중인 녹음이 없습니다.'))
        return
      }

      recorder.onstop = () => {
        const mimeType =
          mimeTypeRef.current || recorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const file = new File(
          [blob],
          `answer-${Date.now()}.${getFileExtension(mimeType)}`,
          { type: mimeType }
        )

        stopStream(streamRef.current)
        streamRef.current = null
        mediaRecorderRef.current = null
        chunksRef.current = []
        mimeTypeRef.current = ''
        setStatus('ready')

        resolve({
          blob,
          file,
          mimeType,
          size: blob.size,
        })
      }

      recorder.onerror = () => {
        cleanup()
        setStatus('error')
        setErrorMessage('녹음 파일을 생성하지 못했습니다.')
        reject(new Error('녹음 파일을 생성하지 못했습니다.'))
      }

      recorder.stop()
    })
  }, [cleanup])

  return {
    status,
    errorMessage,
    startRecording,
    stopRecording,
    reset,
  }
}
