'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import {
  AUTH_REDIRECT_STORAGE_KEY,
  AUTH_ROUTE_GUARD_COOKIE_NAME,
  DEFAULT_AUTHENTICATED_PATH,
  getSafeRedirectPath,
  LOGIN_PATH,
} from '@/lib/auth/routes'
import { useAuthStore } from '@/lib/stores/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

function consumePendingAuthRedirectPath() {
  try {
    const redirectPath = window.sessionStorage.getItem(
      AUTH_REDIRECT_STORAGE_KEY
    )

    window.sessionStorage.removeItem(AUTH_REDIRECT_STORAGE_KEY)

    return getSafeRedirectPath(redirectPath)
  } catch {
    return DEFAULT_AUTHENTICATED_PATH
  }
}

function writeAuthRouteGuardCookie(maxAgeSeconds: number) {
  const secureAttribute =
    window.location.protocol === 'https:' ? '; Secure' : ''

  document.cookie = `${AUTH_ROUTE_GUARD_COOKIE_NAME}=1; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secureAttribute}`
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const status = useAuthStore((state) => state.status)
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  useEffect(() => {
    if (status !== 'authenticated') {
      if (status === 'unauthenticated') {
        writeAuthRouteGuardCookie(0)
      }

      return
    }

    writeAuthRouteGuardCookie(60 * 60 * 24)

    const redirectPath = consumePendingAuthRedirectPath()

    if (redirectPath === DEFAULT_AUTHENTICATED_PATH) {
      return
    }

    if (pathname === LOGIN_PATH || pathname === DEFAULT_AUTHENTICATED_PATH) {
      router.replace(redirectPath)
    }
  }, [pathname, router, status])

  return children
}
