'use client'

import { create } from 'zustand'

import { fetchCurrentUser, logoutCurrentUser } from '@/lib/api/auth'
import type { UserMeResponse } from '@/types/user'

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error'

interface AuthState {
  user: UserMeResponse | null
  status: AuthStatus
  errorMessage: string
  initialize: () => Promise<void>
  refreshCurrentUser: () => Promise<UserMeResponse | null>
  logout: () => Promise<void>
  markLoginRedirectStarted: () => void
  clearSession: () => void
  clearError: () => void
}

let currentUserRequest: Promise<UserMeResponse | null> | null = null

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

  logout: async () => {
    const previousState = get()

    set({ status: 'loading', errorMessage: '' })

    try {
      await logoutCurrentUser()
      set({ user: null, status: 'unauthenticated', errorMessage: '' })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '로그아웃하지 못했습니다.'

      set({
        user: previousState.user,
        status: previousState.status,
        errorMessage,
      })
      throw error
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
