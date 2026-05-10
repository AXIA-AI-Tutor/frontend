import type { AnswerResponse } from '@/types/answer'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatDurationLabel(seconds: number) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

function getSecondsFromDateRange(
  startedAt: string | null | undefined,
  endedAt: string | null | undefined
) {
  if (!startedAt || !endedAt) {
    return null
  }

  const startedAtMs = new Date(startedAt).getTime()
  const endedAtMs = new Date(endedAt).getTime()

  if (!Number.isFinite(startedAtMs) || !Number.isFinite(endedAtMs)) {
    return null
  }

  const seconds = Math.round((endedAtMs - startedAtMs) / 1000)

  return seconds >= 0 ? seconds : null
}

export function getAnswerDurationLabel(
  answer: Pick<AnswerResponse, 'durationSec' | 'startedAt' | 'endedAt'>
) {
  const seconds =
    answer.durationSec ??
    getSecondsFromDateRange(answer.startedAt, answer.endedAt)

  return seconds == null ? undefined : formatDurationLabel(seconds)
}
