import Image from 'next/image'

import type { AvatarGender } from '@/lib/stores/avatar'
import type { MouthShape } from '@/lib/tts/mouthCue'

const AVATAR_IMAGES: Record<AvatarGender, Record<MouthShape, string>> = {
  female: {
    closed: '/avatars/avatar_female_mouse_close.png',
    open: '/avatars/avatar_female_mouse_open_1.png',
    open_big: '/avatars/avatar_female_mouse_open_big.png',
  },
  male: {
    closed: '/avatars/avatar_male_mouse_close.png',
    open: '/avatars/avatar_male_mouse_open_1.png',
    open_big: '/avatars/avatar_male_mouse_open_big.png',
  },
}

interface CoachAvatarProps {
  gender?: AvatarGender
  mouthShape?: MouthShape
}

export function CoachAvatar({
  gender = 'female',
  mouthShape = 'closed',
}: CoachAvatarProps) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={AVATAR_IMAGES[gender][mouthShape]}
        alt="AI Coach Avatar"
        fill
        style={{ objectFit: 'cover', objectPosition: 'top center' }}
        priority
      />
    </div>
  )
}
