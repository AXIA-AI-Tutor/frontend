import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { LiveAudioWaveform } from '@/components/live/LiveAudioWaveform'

interface LiveMetricsProps {
  duration: string
  totalDuration: string
  eyeContact: number
  posture: number
  isRecording: boolean
  currentTurn: number
  waveformResetSignal: number
}

export function LiveMetrics({
  duration,
  totalDuration,
  eyeContact,
  posture,
  isRecording,
  currentTurn,
  waveformResetSignal,
}: LiveMetricsProps) {
  return (
    <section className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm lg:mb-0 lg:rounded-lg lg:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-950">실시간 분석</h3>
          <p className="mt-0.5 text-xs font-bold text-slate-400">
            시선과 자세 신호를 함께 추적합니다.
          </p>
        </div>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black',
            isRecording
              ? 'bg-red-50 text-red-500'
              : 'bg-slate-100 text-slate-500'
          )}
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              isRecording ? 'bg-red-500' : 'bg-slate-400'
            )}
          />
          {isRecording ? '녹음 중' : '대기'}
        </div>
      </div>

      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span className="text-xs font-black tabular-nums text-slate-600">
          {duration} / {totalDuration}
        </span>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-600">
          턴 {currentTurn}
        </span>
      </div>

      <LiveAudioWaveform
        isRecording={isRecording}
        resetSignal={waveformResetSignal}
        className="mb-4"
      />

      <div className="space-y-4">
        <MetricBar label="Eye Contact" value={eyeContact} tone="blue" />
        <MetricBar label="Posture" value={posture} tone="emerald" />
      </div>
    </section>
  )
}

interface MetricBarProps {
  label: string
  value: number
  tone: 'blue' | 'emerald'
}

function MetricBar({ label, value, tone }: MetricBarProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-black uppercase text-slate-500">
          {label}
        </span>
        <span className="text-xs font-black text-slate-700">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            'h-full rounded-full w-(--progress-width)',
            tone === 'blue'
              ? 'bg-linear-to-r from-blue-500 to-sky-400'
              : 'bg-linear-to-r from-emerald-500 to-lime-400'
          )}
          style={{ '--progress-width': `${value}%` } as CSSProperties}
        />
      </div>
    </div>
  )
}
