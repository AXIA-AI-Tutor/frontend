'use client'

import { useEffect, useRef } from 'react'

interface WaveCardProps {
  recTime: string
}

export function WaveCard({ recTime }: WaveCardProps) {
  const waveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!waveRef.current) return
    waveRef.current.innerHTML = Array.from({ length: 52 }, (_, i) => {
      const h = 12 + Math.abs(Math.sin(i)) * 30
      return `<span style="display:inline-block;width:4px;border-radius:99px;background:linear-gradient(180deg,#1d9bf0,#8b5cf6);height:${h}px;animation:wave 1.1s ease-in-out infinite;animation-delay:${i * 0.035}s;opacity:.9"></span>`
    }).join('')
  }, [])

  return (
    <>
      {/* wave keyframes — 전역 CSS가 없으므로 style 태그로 삽입 */}
      <style>{`@keyframes wave{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1.25)}}`}</style>
      <div className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[13px] font-black text-red-500">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_0_7px_rgba(239,68,68,.09)]" />
            녹음 중...
          </span>
          <span className="text-xs text-slate-500">{recTime}</span>
        </div>
        <small className="text-xs text-slate-400">자연스럽게 말해보세요.</small>
        <div ref={waveRef} className="mt-1 flex h-[50px] items-center gap-[3px] overflow-hidden" />
      </div>
    </>
  )
}