'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [])

  const handleSelect = (opt: string) => {
    setSelected(opt)
    setOpen(false)
    onSelect?.(opt)
  }

  return (
    <div ref={ref} className="relative z-[70]">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-800"
      >
        {selected}
        <ChevronDown
          size={14}
          className={cn(
            'shrink-0 transition-transform duration-200 ease-out',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-[90] mt-1 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-blue-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
