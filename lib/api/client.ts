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

export function isApiError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError(error)
}
