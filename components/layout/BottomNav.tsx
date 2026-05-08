'use client'

import { cn } from '@/lib/utils'
import type { Screen } from '@/types'

// 하드코딩 필요 판단: UI 고정 네비게이션 항목
const NAV_ITEMS = [
  { icon: '⌂', label: '홈', screen: 'home' as Screen },
  { icon: '▷', label: '연습', screen: 'live' as Screen },
  { icon: '▥', label: '리포트', screen: 'report' as Screen },
]

interface BottomNavProps {
  current: Screen
  onNavigate: (screen: Screen) => void
  disabledScreens?: Screen[]
}

export function BottomNav({
  current,
  onNavigate,
  disabledScreens = [],
}: BottomNavProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[3] grid h-17 grid-cols-3 border-t border-slate-200 bg-white/92 px-2 pb-1.5 pt-2 lg:hidden">
      {NAV_ITEMS.map(({ icon, label, screen }) => {
        const isDisabled = disabledScreens.includes(screen)
        return (
          <button
            key={label}
            onClick={() => !isDisabled && onNavigate(screen)}
            disabled={isDisabled}
            className={cn(
              'grid place-items-center text-[10.5px] font-black',
              isDisabled
                ? 'cursor-not-allowed opacity-40'
                : screen === current
                  ? 'text-blue-600'
                  : 'text-slate-400'
            )}
          >
            <span className="text-[21px] leading-5">{icon}</span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
