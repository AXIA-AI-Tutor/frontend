'use client'

import type { CSSProperties } from 'react'
import type { TurnChartPoint } from '@/types/report'

interface TurnChartProps {
  points: TurnChartPoint[]
  onPointClick?: (idx: number, msg: string) => void
}

export function TurnChart({ points, onPointClick }: TurnChartProps) {
  const scoreLinePoints = points.map(({ x, y }) => `${x},${y}`).join(' ')

  return (
    <div className="h-34.5 lg:h-41.5">
      <h3 className="text-sm font-black">턴별 점수 변화</h3>
      <div className="relative mt-2 h-21 overflow-hidden border-b border-l border-slate-200 lg:mt-3 lg:h-29.5">
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
            points={scoreLinePoints}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {points.map(({ x, y, label, msg }, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => onPointClick?.(idx, msg)}
            className="absolute h-3.25 w-3.25 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-blue-600 shadow-md transition-transform hover:scale-125 left-(--point-x) top-(--point-y)"
            style={
              { '--point-x': `${x}%`, '--point-y': `${y}%` } as CSSProperties
            }
            title={msg}
            aria-label={msg}
          />
        ))}

        {points.map(({ x, label }) => (
          <span
            key={label}
            className="pointer-events-none absolute bottom-1 hidden -translate-x-1/2 text-[10px] font-bold text-slate-400 lg:block left-(--point-x)"
            style={{ '--point-x': `${x}%` } as CSSProperties}
            aria-hidden="true"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
