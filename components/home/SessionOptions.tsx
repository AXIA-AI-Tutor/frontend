'use client'

import { Dropdown } from '@/components/ui/Dropdown'
import type { SessionDifficulty, SessionTarget } from '@/types/session'

const DIFFICULTY_LABELS: Record<SessionDifficulty, string> = {
  EASY: '쉬움',
  NORMAL: '보통',
  HARD: '어려움',
}

const LABEL_TO_DIFFICULTY = Object.fromEntries(
  (Object.entries(DIFFICULTY_LABELS) as [SessionDifficulty, string][]).map(
    ([k, v]) => [v, k]
  )
) as Record<string, SessionDifficulty>

const SESSION_TARGETS: SessionTarget[] = [
  'BACKEND',
  'FRONTEND',
  'FULLSTACK',
  'AI_ML',
  'DATA',
  'DEVOPS',
  'MOBILE',
  'QA',
]

function isSessionTarget(value: string): value is SessionTarget {
  return SESSION_TARGETS.includes(value as SessionTarget)
}

interface SessionOptionsProps {
  onSelect?: (
    key: 'difficulty' | 'target',
    value: SessionDifficulty | SessionTarget
  ) => void
}

export function SessionOptions({ onSelect }: SessionOptionsProps) {
  return (
    <div className="relative z-20 grid grid-cols-3 divide-x divide-slate-100">
      <div className="px-3 py-3">
        <small className="mb-[7px] flex items-center gap-1 text-[11px] font-black text-slate-700">
          ▮ 난이도
        </small>
        <Dropdown
          label={DIFFICULTY_LABELS.NORMAL}
          options={Object.values(DIFFICULTY_LABELS)}
          onSelect={(label) => {
            const difficulty = LABEL_TO_DIFFICULTY[label]

            if (difficulty) {
              onSelect?.('difficulty', difficulty)
            }
          }}
        />
      </div>
      <div className="px-3 py-3">
        <small className="mb-[7px] flex items-center gap-1 text-[11px] font-black text-slate-700">
          ◎ 지원 직무
        </small>
        <Dropdown
          label={SESSION_TARGETS[0]}
          options={SESSION_TARGETS}
          onSelect={(v) => {
            if (isSessionTarget(v)) {
              onSelect?.('target', v)
            }
          }}
        />
      </div>
    </div>
  )
}
