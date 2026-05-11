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
    name: 'AI Coach Female',
    copy: 'Warm and clear feedback with a softer voice profile.',
  },
  {
    id: 'male',
    name: 'AI Coach Male',
    copy: 'Direct interview-style feedback with a lower voice profile.',
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
    <div className="grid grid-cols-[128px_1fr] items-center gap-3 p-2.5">
      <div className="relative grid h-[126px] place-items-end overflow-hidden rounded-2xl bg-gradient-to-b from-blue-100 to-blue-50">
        <CoachAvatar gender={selectedAvatarId} />
        <span className="absolute bottom-2.5 left-2 grid h-8 w-8 place-items-center rounded-full bg-white text-blue-600 shadow-md">
          {avatar.id === 'female' ? 'F' : 'M'}
        </span>
      </div>
      <div>
        <h3 className="text-[15px] font-bold">{avatar.name}</h3>
        <p className="mt-1 whitespace-pre-line text-[11.5px] text-slate-500">
          {avatar.copy}
        </p>
        <button
          type="button"
          onClick={handleChange}
          className="mt-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-700"
        >
          Change avatar
        </button>
      </div>
    </div>
  )
}
