'use client'

import { create } from 'zustand'

import { fetchCurrentUser, type CurrentUser } from '@/lib/api/auth'

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error'

interface AuthState {
  user: CurrentUser | null
  status: AuthStatus
  errorMessage: string
  initialize: () => Promise<void>
  refreshCurrentUser: () => Promise<CurrentUser | null>
  markLoginRedirectStarted: () => void
  clearSession: () => void
  clearError: () => void
}

let currentUserRequest: Promise<CurrentUser | null> | null = null

function requestCurrentUser() {
  currentUserRequest ??= fetchCurrentUser().finally(() => {
    currentUserRequest = null
  })

  return currentUserRequest
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',
  errorMessage: '',

  initialize: async () => {
    const { status } = get()

    if (status !== 'idle') {
      return
    }

    await get().refreshCurrentUser()
  },

  refreshCurrentUser: async () => {
    set({ status: 'loading', errorMessage: '' })

    try {
      const user = await requestCurrentUser()

      if (user) {
        set({ user, status: 'authenticated', errorMessage: '' })
        return user
      }

      set({ user: null, status: 'unauthenticated', errorMessage: '' })
      return null
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로그인 상태를 확인하지 못했습니다.'

      set({ user: null, status: 'error', errorMessage })
      return null
    }
  },

  markLoginRedirectStarted: () => {
    set({ status: 'loading', errorMessage: '' })
  },

  clearSession: () => {
    set({ user: null, status: 'unauthenticated', errorMessage: '' })
  },

  clearError: () => {
    set({ errorMessage: '' })
  },
}))

export function selectIsAuthChecking(status: AuthStatus) {
  return status === 'idle' || status === 'loading'
}
