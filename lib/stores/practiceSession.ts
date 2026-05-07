'use client'

import { create } from 'zustand'

import type { SessionStartResponse } from '@/types/session'

interface PracticeSessionState {
  sessionStart: SessionStartResponse | null
  setSessionStart: (sessionStart: SessionStartResponse) => void
  clearSessionStart: () => void
}

export const usePracticeSessionStore = create<PracticeSessionState>((set) => ({
  sessionStart: null,
  setSessionStart: (sessionStart) => set({ sessionStart }),
  clearSessionStart: () => set({ sessionStart: null }),
}))
