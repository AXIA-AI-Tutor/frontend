import { apiClient, isApiError, type ApiResponse } from './client'
import type { UserMeResponse } from '@/types/user'

export type { UserMeResponse }

function getApiBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!url) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수가 필요합니다.')
  }

  return url.replace(/\/$/, '')
}

export function getGoogleOAuthAuthorizationUrl() {
  return `${getApiBaseUrl()}/oauth2/authorization/google`
}

export async function logoutCurrentUser() {
  // Spring Security의 /logout은 세션 무효화 후 302 리다이렉트를 반환하므로
  // axios 대신 fetch + redirect: 'manual'로 opaqueredirect를 처리한다.
  const response = await fetch(`${getApiBaseUrl()}/logout`, {
    cache: 'no-store',
    credentials: 'include',
    redirect: 'manual',
    headers: {
      Accept: 'application/json',
    },
  })

  if (response.ok || response.type === 'opaqueredirect') {
    return
  }

  if (response.status === 401) {
    return
  }

  throw new Error('로그아웃하지 못했습니다.')
}

export async function fetchCurrentUser(): Promise<UserMeResponse | null> {
  try {
    const response =
      await apiClient.get<ApiResponse<UserMeResponse>>('/api/users/me')

    return response.data.data
  } catch (error) {
    if (
      isApiError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      return null
    }

    throw error
  }
}
