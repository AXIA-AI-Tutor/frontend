import { cn } from '@/lib/utils'

interface Metric {
  label: string
  tag: string
  tagWarn: boolean
  value: string
  sub: string
}

interface LiveMetricsProps {
  wpm: number
  eye: number
  pose: number
}

export function LiveMetrics({ wpm, eye, pose }: LiveMetricsProps) {
  const metrics: Metric[] = [
    { label: '속도', tag: '적정', tagWarn: false, value: String(wpm), sub: 'wpm 〽' },
    { label: '시선', tag: '좋음', tagWarn: false, value: `${eye}%`, sub: '👁 집중' },
    { label: '자세', tag: '주의', tagWarn: true, value: `-${pose}°`, sub: '↕ 기울어짐' },
  ]

  return (
    <div className="grid grid-cols-3 gap-[7px] mb-2.5">
      {metrics.map(({ label, tag, tagWarn, value, sub }) => (
        <div key={label} className="min-h-[74px] rounded-[15px] border border-slate-200 bg-white p-[11px_9px] shadow-sm">
          <b className="flex items-center justify-between text-[11px] text-slate-600">
            {label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[9px]',
                tagWarn ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'
              )}
            >
              {tag}
            </span>
          </b>
          <strong className="mt-1.5 block text-2xl tracking-tight">{value}</strong>
          <span className="text-[10px] text-slate-400">{sub}</span>
        </div>
      ))}
    </div>
  )
}