interface MemoryChipsProps {
  chips: string[]
}

export function MemoryChips({ chips }: MemoryChipsProps) {
  return (
    <div>
      <h3 className="mb-2 text-[15px] font-black">AI가 기억한 나</h3>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10.5px] text-slate-600"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}