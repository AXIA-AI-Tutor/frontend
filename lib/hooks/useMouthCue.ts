import { useEffect, useState } from 'react'

import { buildMouthCueSchedule, type MouthShape } from '@/lib/tts/mouthCue'

export function useMouthCue(
  text: string | null,
  isPlaying: boolean
): MouthShape {
  const [animatedShape, setAnimatedShape] = useState<MouthShape>('closed')

  useEffect(() => {
    if (!isPlaying || !text) {
      return
    }

    const schedule = buildMouthCueSchedule(text)
    const timers = schedule.map(({ shape, delay }) =>
      setTimeout(() => setAnimatedShape(shape), delay)
    )

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [text, isPlaying])

  // isPlaying이 false이면 렌더 시점에 closed 반환 (effect 내 setState 불필요)
  return isPlaying ? animatedShape : 'closed'
}
