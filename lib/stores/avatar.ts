'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AvatarId = 'female' | 'male'
export type AvatarGender = 'female' | 'male'

interface AvatarProfile {
  id: AvatarId
  gender: AvatarGender
  preferredVoiceNames: string[]
}

const AVATAR_PROFILES: Record<AvatarId, AvatarProfile> = {
  female: {
    id: 'female',
    gender: 'female',
    preferredVoiceNames: [
      'Yuna',
      'Sora',
      'Seoyeon',
      'SunHi',
      'Heami',
      'Female',
    ],
  },
  male: {
    id: 'male',
    gender: 'male',
    preferredVoiceNames: ['InJoon', 'Hyunsu', 'Male'],
  },
}

interface AvatarState {
  selectedAvatarId: AvatarId
  gender: AvatarGender
  preferredVoiceNames: string[]
  setSelectedAvatar: (avatarId: AvatarId) => void
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      selectedAvatarId: 'female',
      gender: AVATAR_PROFILES.female.gender,
      preferredVoiceNames: AVATAR_PROFILES.female.preferredVoiceNames,
      setSelectedAvatar: (avatarId) => {
        const profile = AVATAR_PROFILES[avatarId]

        set({
          selectedAvatarId: profile.id,
          gender: profile.gender,
          preferredVoiceNames: profile.preferredVoiceNames,
        })
      },
    }),
    {
      name: 'ai-coach:selected-avatar',
      partialize: (state) => ({ selectedAvatarId: state.selectedAvatarId }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }

        const profile = AVATAR_PROFILES[state.selectedAvatarId]
        state.gender = profile.gender
        state.preferredVoiceNames = profile.preferredVoiceNames
      },
    }
  )
)
