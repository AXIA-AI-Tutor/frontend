'use client'

import { cn } from '@/lib/utils'
import type { Screen } from '@/types'

const TABS: { label: string; screen: Screen }[] = [
  { label: '홈 / 세션 준비', screen: 'home' },
  { label: '실시간 연습', screen: 'live' },
  { label: '턴 피드백', screen: 'feedback' },
  { label: '세션 리포트', screen: 'report' },
]

interface TopBarProps {
  current: Screen
  onChange: (screen: Screen) => void
}

export function TopBar({ current, onChange }: TopBarProps) {
  return (
    <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4">
      {/* 브랜드 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-2 text-sm font-black text-blue-700 shadow-sm">
          ✨ AI 코치 앱 · 인터랙티브 HTML 프로토타입
        </span>
        <span className="text-xs font-bold text-slate-500">
          그림 구조 유지 · 클릭형 UI/UX 설명 포함
        </span>
      </div>

      {/* 화면 전환 탭 */}
      <nav className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
        {TABS.map(({ label, screen }) => (
          <button
            key={screen}
            onClick={() => onChange(screen)}
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-2 text-sm font-black transition-all',
              current === screen
                ? 'bg-gradient-to-br from-blue-400 to-purple-700 text-white shadow-lg'
                : 'bg-transparent text-slate-500'
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}