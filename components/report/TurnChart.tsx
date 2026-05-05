'use client'

interface TurnChartProps {
  onPointClick?: (idx: number, msg: string) => void
}

const POINTS = [
  { x: 18, y: 57, label: 'T1', msg: 'T1: 구조는 좋지만 예시 부족' },
  { x: 48, y: 35, label: 'T2', msg: 'T2: 구체성이 개선됨' },
  { x: 80, y: 18, label: 'T3', msg: 'T3: 종합 점수 82점' },
]
const SCORE_LINE_POINTS = POINTS.map(({ x, y }) => `${x},${y}`).join(' ')

export function TurnChart({ onPointClick }: TurnChartProps) {
  return (
    <div className="h-[138px] lg:h-[166px]">
      <h3 className="text-sm font-black">턴별 점수 변화</h3>
      <div className="relative mt-2 h-[84px] overflow-hidden border-b border-l border-slate-200 lg:mt-3 lg:h-[118px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[25, 50, 75].map((y) => (
            <line
              key={y}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              stroke="#edf2ff"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polyline
            fill="none"
            stroke="#a8b3cf"
            strokeDasharray="5 5"
            strokeWidth="3"
            points="18,72 48,60 80,45"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            points={SCORE_LINE_POINTS}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {POINTS.map(({ x, y, label, msg }, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => onPointClick?.(idx, msg)}
            className="absolute h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-blue-600 shadow-md transition-transform hover:scale-125"
            style={{ left: `${x}%`, top: `${y}%` }}
            title={msg}
            aria-label={msg}
          />
        ))}

        {POINTS.map(({ x, label }) => (
          <span
            key={label}
            className="pointer-events-none absolute bottom-1 hidden -translate-x-1/2 text-[10px] font-bold text-slate-400 lg:block"
            style={{ left: `${x}%` }}
            aria-hidden="true"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
