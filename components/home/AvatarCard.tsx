'use client'

import { CoachAvatar } from '@/components/ui/CoachAvatar'
import { useAvatarStore, type AvatarId } from '@/lib/stores/avatar'

const AVATARS: Array<{
  id: AvatarId
  name: string
  copy: string
}> = [
  {
    id: 'female',
    name: 'AI 코치 · 여성',
    copy: '부드러운 목소리로 따뜻하고 명확한 피드백을 제공합니다.',
  },
  {
    id: 'male',
    name: 'AI 코치 · 남성',
    copy: '낮고 안정적인 목소리로 실전 면접 스타일의 피드백을 제공합니다.',
  },
]

interface AvatarCardProps {
  onChangeAvatar?: (name: string) => void
}

export function AvatarCard({ onChangeAvatar }: AvatarCardProps) {
  const selectedAvatarId = useAvatarStore((state) => state.selectedAvatarId)
  const setSelectedAvatar = useAvatarStore((state) => state.setSelectedAvatar)
  const idx = Math.max(
    0,
    AVATARS.findIndex((avatar) => avatar.id === selectedAvatarId)
  )
  const avatar = AVATARS[idx]

  const handleChange = () => {
    const next = (idx + 1) % AVATARS.length
    const nextAvatar = AVATARS[next]

    setSelectedAvatar(nextAvatar.id)
    onChangeAvatar?.(nextAvatar.name)
  }

  return (
    <div className="grid grid-cols-[160px_1fr] items-stretch gap-3 p-2.5">
      <div className="relative self-stretch overflow-hidden rounded-2xl bg-linear-to-b from-blue-100 to-blue-50">
        <CoachAvatar gender={selectedAvatarId} />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-[15px] font-bold">{avatar.name}</h3>
        <p className="mt-1 whitespace-pre-line text-[11.5px] text-slate-500">
          {avatar.copy}
        </p>
        <button
          type="button"
          onClick={handleChange}
          className="mt-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-700"
        >
          아바타 변경
        </button>
      </div>
    </div>
  )
}
