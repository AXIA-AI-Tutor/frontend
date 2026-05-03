import { cn } from '@/lib/utils'
import { LiveAudioWaveform } from '@/components/live/LiveAudioWaveform'

interface NumberMetric {
  label: string
  value: string
  unit?: string
}

interface LiveMetricsProps {
  duration: string
  totalDuration: string
  speechRate: number
  silence: number
  fillers: number
  eyeContact: number
  posture: number
  isRecording: boolean
  waveformResetSignal: number
}

export function LiveMetrics({
  duration,
  totalDuration,
  speechRate,
  silence,
  fillers,
  eyeContact,
  posture,
  isRecording,
  waveformResetSignal,
}: LiveMetricsProps) {
  const numberMetrics: NumberMetric[] = [
    {
      label: 'Duration',
      value: `${duration} / ${totalDuration}`,
    },
    {
      label: 'Speech Rate',
      value: String(speechRate),
      unit: 'wpm',
    },
    {
      label: 'Silence',
      value: silence.toFixed(1),
      unit: 'sec',
    },
    {
      label: 'Fillers',
      value: String(fillers),
      unit: '회',
    },
  ]

  return (
    <section className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm lg:mb-0 lg:rounded-lg lg:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-950">실시간 분석</h3>
          <p className="mt-0.5 text-xs font-bold text-slate-400">
            발화와 자세 신호를 함께 추적합니다.
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

      <LiveAudioWaveform
        isRecording={isRecording}
        resetSignal={waveformResetSignal}
        className="mb-4"
      />

      <div className="grid grid-cols-2 gap-2.5">
        {numberMetrics.map(({ label, value, unit }) => (
          <div
            key={label}
            className="min-h-[70px] rounded-lg border border-slate-200 bg-white p-3"
          >
            <span className="text-[11px] font-black uppercase text-slate-400">
              {label}
            </span>
            <strong className="mt-2 flex items-end gap-1 text-xl font-black tracking-tight text-slate-950">
              {value}
              {unit ? (
                <small className="pb-0.5 text-[11px] font-bold text-slate-400">
                  {unit}
                </small>
              ) : null}
            </strong>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-4">
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
            'h-full rounded-full',
            tone === 'blue'
              ? 'bg-gradient-to-r from-blue-500 to-sky-400'
              : 'bg-gradient-to-r from-emerald-500 to-lime-400'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
