'use client'

interface ScoreRingProps {
  score: number
  max?: number
}

export function ScoreRing({ score, max = 100 }: ScoreRingProps) {
  const pct = (score / max) * 100

  return (
    <div
      className="relative grid h-24 w-24 place-items-center rounded-full"
      style={{
        background: `conic-gradient(#2563eb 0 ${pct}%, #e3e9fb ${pct}%)`,
      }}
    >
      {/* 안쪽 흰 원 */}
      <div className="absolute inset-2.5 rounded-full bg-white" />
      <div className="relative z-10 text-center">
        <strong className="block text-[28px] leading-none">{score}</strong>
        <small className="text-[10px] text-slate-500">/{max}</small>
      </div>
    </div>
  )
}
