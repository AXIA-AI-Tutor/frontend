import { describe, expect, it } from 'vitest'

import {
  createLoginRedirectPath,
  getRedirectPathFromSearch,
  getSafeRedirectPath,
  isProtectedRoutePath,
} from './routes'

describe('auth route helpers', () => {
  it('matches routes that require an authenticated session', () => {
    expect(isProtectedRoutePath('/')).toBe(true)
    expect(isProtectedRoutePath('/live')).toBe(true)
    expect(isProtectedRoutePath('/feedback/detail')).toBe(true)
    expect(isProtectedRoutePath('/login')).toBe(false)
    expect(isProtectedRoutePath('/public/file.svg')).toBe(false)
  })

  it('creates a login path with a safe next path', () => {
    expect(createLoginRedirectPath('/live', '?mode=practice')).toBe(
      '/login?next=%2Flive%3Fmode%3Dpractice'
    )
    expect(createLoginRedirectPath('/')).toBe('/login')
  })

  it('falls back to home for unsafe redirect paths', () => {
    expect(getSafeRedirectPath('https://example.com/live')).toBe('/')
    expect(getSafeRedirectPath('//example.com/live')).toBe('/')
    expect(getSafeRedirectPath('/login?next=/live')).toBe('/')
    expect(getRedirectPathFromSearch('?next=%2Freport')).toBe('/report')
  })
})
