interface ScoreItem {
  label: string
  score: number
}

interface ScoreRowProps {
  scores: ScoreItem[]
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
          <b className="text-sm">{score.toFixed(1)}</b>
        </div>
      ))}
    </div>
  )
}
