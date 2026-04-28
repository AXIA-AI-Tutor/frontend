'use client'

import { useState } from 'react'
import { CoachAvatar } from '@/components/ui/CoachAvatar'

const AVATARS = [
  { name: 'AI 코치 아바타', copy: '친절하고 꼼꼼한 피드백으로\n성장을 도와드릴게요!' },
  { name: '압박 면접관', copy: '짧고 날카로운 꼬리질문으로\n실전 긴장감을 높여드릴게요!' },
  { name: '발표 코치', copy: '청중 관점에서 구조와 전달력을\n집중 점검해드릴게요!' },
]

interface AvatarCardProps {
  onChangeAvatar?: (name: string) => void
}

export function AvatarCard({ onChangeAvatar }: AvatarCardProps) {
  const [idx, setIdx] = useState(0)
  const avatar = AVATARS[idx]

  const handleChange = () => {
    const next = (idx + 1) % AVATARS.length
    setIdx(next)
    onChangeAvatar?.(AVATARS[next].name)
  }

  return (
    <div className="grid grid-cols-[128px_1fr] items-center gap-3 p-2.5">
      {/* 아바타 박스 */}
      <div className="relative grid h-[126px] place-items-end rounded-2xl overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50">
        <CoachAvatar />
        {/* 사운드 아이콘 */}
        <span className="absolute bottom-2.5 left-2 grid h-8 w-8 place-items-center rounded-full bg-white text-blue-600 shadow-md">
          ▮
        </span>
      </div>
      {/* 텍스트 */}
      <div>
        <h3 className="text-[15px] font-bold">{avatar.name}</h3>
        <p className="mt-1 text-[11.5px] text-slate-500 whitespace-pre-line">{avatar.copy}</p>
        <button
          onClick={handleChange}
          className="mt-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-700"
        >
          ↻ 아바타 변경
        </button>
      </div>
    </div>
  )
}