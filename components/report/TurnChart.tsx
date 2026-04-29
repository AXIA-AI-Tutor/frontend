'use client'

interface TurnChartProps {
  onPointClick?: (idx: number, msg: string) => void
}

const POINTS = [
  { cx: '18%', cy: '57%', msg: 'T1: 구조는 좋지만 예시 부족' },
  { cx: '48%', cy: '35%', msg: 'T2: 구체성이 개선됨' },
  { cx: '80%', cy: '18%', msg: 'T3: 종합 점수 82점' },
]

export function TurnChart({ onPointClick }: TurnChartProps) {
  return (
    <div className="h-[138px]">
      <h3 className="text-sm font-black">턴별 점수 변화</h3>
      <div
        className="relative mt-2 h-[84px]"
        style={{
          borderLeft: '1px solid #d9e0f2',
          borderBottom: '1px solid #d9e0f2',
          background:
            'linear-gradient(180deg,transparent 24%,#edf2ff 25%,transparent 26%,transparent 49%,#edf2ff 50%,transparent 51%,transparent 74%,#edf2ff 75%,transparent 76%)',
        }}
      >
        <svg
          className="absolute inset-0"
          viewBox="0 0 320 84"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            points="50,58 155,38 260,20"
          />
          <polyline
            fill="none"
            stroke="#a8b3cf"
            strokeWidth="3"
            strokeDasharray="5 5"
            points="50,72 155,60 260,45"
          />
        </svg>
        {POINTS.map(({ cx, cy, msg }, idx) => (
          <button
            key={idx}
            onClick={() => onPointClick?.(idx, msg)}
            className="absolute h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-blue-600 shadow-md hover:scale-125 transition-transform"
            style={{ left: cx, top: cy }}
            title={msg}
          />
        ))}
      </div>
    </div>
  )
}
