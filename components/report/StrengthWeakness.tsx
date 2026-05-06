interface StrengthWeaknessProps {
  strengths: string[]
  weaknesses: string[]
}

export function StrengthWeakness({
  strengths,
  weaknesses,
}: StrengthWeaknessProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm">
        <h4 className="mb-2 text-[13px] font-black">잘한 점 (강점)</h4>
        <ul className="list-disc pl-4">
          {strengths.map((s) => (
            <li
              key={s}
              className="mb-1 text-[10.8px] leading-snug text-emerald-500"
            >
              <span className="text-slate-700">{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm">
        <h4 className="mb-2 text-[13px] font-black">보완할 점 (약점)</h4>
        <ul className="list-disc pl-4">
          {weaknesses.map((w) => (
            <li
              key={w}
              className="mb-1 text-[10.8px] leading-snug text-red-500"
            >
              <span className="text-slate-700">{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
