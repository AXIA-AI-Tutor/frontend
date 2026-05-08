import { apiClient, type ApiResponse } from './client'
import type {
  SessionNextQuestionResponse,
  SessionResponse,
  SessionStartRequest,
  SessionStartResponse,
} from '@/types/session'

export async function createSession(): Promise<SessionResponse> {
  const response =
    await apiClient.post<ApiResponse<SessionResponse>>('/api/sessions')

  return response.data.data
}

export async function startSession(
  sessionId: number,
  payload: SessionStartRequest
): Promise<SessionStartResponse> {
  const response = await apiClient.patch<ApiResponse<SessionStartResponse>>(
    `/api/sessions/${sessionId}/start`,
    payload
  )

  return response.data.data
}

export async function nextQuestion(
  sessionId: number
): Promise<SessionNextQuestionResponse> {
  const response = await apiClient.post<
    ApiResponse<SessionNextQuestionResponse>
  >(`/api/sessions/${sessionId}/questions/next`)

  return response.data.data
}

export async function completeSession(sessionId: number): Promise<void> {
  await apiClient.patch(`/api/sessions/${sessionId}/complete`)
}
