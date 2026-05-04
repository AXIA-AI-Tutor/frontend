const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface CurrentUser {
  id?: number | string
  name?: string
  email?: string
  imageUrl?: string
  [key: string]: unknown
}

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수가 필요합니다.')
  }

  return API_BASE_URL.replace(/\/$/, '')
}

export function getGoogleOAuthAuthorizationUrl() {
  return `${getApiBaseUrl()}/oauth2/authorization/google`
}

export async function fetchCurrentUser() {
  const response = await fetch(`${getApiBaseUrl()}/api/users/me`, {
    cache: 'no-store',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (response.status === 401 || response.status === 403) {
    return null
  }

  if (!response.ok) {
    throw new Error('현재 로그인한 사용자를 불러오지 못했습니다.')
  }

  return (await response.json()) as CurrentUser
}
