'use client'

import { useState, useRef, useEffect } from 'react'

interface DropdownProps {
  label: string
  options: string[]
  onSelect?: (value: string) => void
}

export function Dropdown({ label, options, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(label)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const handleSelect = (opt: string) => {
    setSelected(opt)
    setOpen(false)
    onSelect?.(opt)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-800"
      >
        {selected} <span>⌄</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="block w-36 rounded-lg border-0 bg-white px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-blue-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}