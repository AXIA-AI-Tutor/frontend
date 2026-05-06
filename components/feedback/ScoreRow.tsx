interface ScoreItem {
  label: string
  score: number | null
}

interface ScoreRowProps {
  scores: ScoreItem[]
}

function clampScore(score: number | null) {
  if (score == null) {
    return 0
  }

  return Math.min(100, Math.max(0, score))
}

export function ScoreRow({ scores }: ScoreRowProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {scores.map(({ label, score }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white p-2 text-center"
        >
          <span className="block text-[10px] font-black text-slate-500">
            {label}
          </span>
          <b className="text-sm">
            {score == null ? '-' : `${Math.round(score)}점`}
          </b>
          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-100">
            <span
              className="block h-full rounded-full bg-blue-500"
              style={{ width: `${clampScore(score)}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  )
}
