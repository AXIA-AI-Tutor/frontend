import { apiClient, type ApiResponse } from './client'
import type { SessionResponse } from '@/types/session'

export async function createSession(): Promise<SessionResponse> {
  const response =
    await apiClient.post<ApiResponse<SessionResponse>>('/api/sessions')

  return response.data.data
}
