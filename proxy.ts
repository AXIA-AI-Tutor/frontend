import { type NextRequest, NextResponse } from 'next/server'

import {
  AUTH_ROUTE_GUARD_COOKIE_NAME,
  createLoginRedirectPath,
  isProtectedRoutePath,
} from '@/lib/auth/routes'

const DEFAULT_AUTH_SESSION_COOKIE_NAMES = ['JSESSIONID', 'SESSION']

function getAuthSessionCookieNames() {
  const configuredCookieNames = process.env.AUTH_SESSION_COOKIE_NAMES?.split(
    ','
  )
    .map((cookieName) => cookieName.trim())
    .filter(Boolean)

  return configuredCookieNames?.length
    ? configuredCookieNames
    : DEFAULT_AUTH_SESSION_COOKIE_NAMES
}

function hasAuthSessionCookie(request: NextRequest) {
  return (
    request.cookies.has(AUTH_ROUTE_GUARD_COOKIE_NAME) ||
    getAuthSessionCookieNames().some((cookieName) =>
      request.cookies.has(cookieName)
    )
  )
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (isProtectedRoutePath(pathname) && !hasAuthSessionCookie(request)) {
    return NextResponse.redirect(
      new URL(createLoginRedirectPath(pathname, search), request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
