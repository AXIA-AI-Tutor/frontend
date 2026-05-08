import axios, { AxiosError } from 'axios'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface ApiErrorResponse {
  success: false
  errorCode: string
  message: string
}

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!url) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL 환경 변수가 필요합니다.')
  }

  return url.replace(/\/$/, '')
}

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 401 응답 시 로그인 페이지로 리다이렉트
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search
      const params = new URLSearchParams({ redirect: currentPath })
      window.location.replace(`/login?${params.toString()}`)
    }
    return Promise.reject(error)
  }
)

export function isApiError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError(error)
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error) && error.response?.data.message) {
    return error.response.data.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}
