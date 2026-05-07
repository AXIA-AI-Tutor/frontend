export const LOGIN_PATH = '/login'
export const DEFAULT_AUTHENTICATED_PATH = '/'
export const AUTH_REDIRECT_STORAGE_KEY = 'ai-coach:auth-redirect-path'
export const AUTH_ROUTE_GUARD_COOKIE_NAME = 'ai_coach_auth_route_guard'

const PROTECTED_ROUTE_PATHS = ['/', '/live', '/feedback', '/report'] as const

export function isProtectedRoutePath(pathname: string) {
  return PROTECTED_ROUTE_PATHS.some((routePath) => {
    if (routePath === DEFAULT_AUTHENTICATED_PATH) {
      return pathname === DEFAULT_AUTHENTICATED_PATH
    }

    return pathname === routePath || pathname.startsWith(`${routePath}/`)
  })
}

export function getSafeRedirectPath(redirectPath: string | null | undefined) {
  const fallbackPath = DEFAULT_AUTHENTICATED_PATH
  const candidate = redirectPath?.trim()

  if (!candidate) {
    return fallbackPath
  }

  if (
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\')
  ) {
    return fallbackPath
  }

  try {
    const redirectUrl = new URL(candidate, 'https://frontend.local')

    if (redirectUrl.origin !== 'https://frontend.local') {
      return fallbackPath
    }

    if (redirectUrl.pathname === LOGIN_PATH) {
      return fallbackPath
    }

    return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
  } catch {
    return fallbackPath
  }
}

export function getRedirectPathFromSearch(search: string) {
  return getSafeRedirectPath(new URLSearchParams(search).get('next'))
}

export function createLoginRedirectPath(pathname: string, search = '') {
  const redirectPath = getSafeRedirectPath(`${pathname}${search}`)

  if (redirectPath === DEFAULT_AUTHENTICATED_PATH) {
    return LOGIN_PATH
  }

  const params = new URLSearchParams({ next: redirectPath })

  return `${LOGIN_PATH}?${params.toString()}`
}
