import { apiClient, type ApiResponse } from './client'
import type { AnswerResponse } from '@/types/answer'
import type {
  AnswerWithFeedbackResponse,
  FeedbackResponse,
} from '@/types/feedback'

export interface SubmitAnswerWithFeedbackPayload {
  questionText: string
  file: File
  eyeContactScore?: number | null
  postureScore?: number | null
  startedAt?: string | null
  endedAt?: string | null
}

function appendOptionalNumber(
  formData: FormData,
  name: string,
  value: number | null | undefined
) {
  if (value === null || value === undefined) {
    return
  }

  formData.append(name, String(value))
}

function appendOptionalString(
  formData: FormData,
  name: string,
  value: string | null | undefined
) {
  if (!value) {
    return
  }

  formData.append(name, value)
}

export async function getSessionAnswers(
  sessionId: number
): Promise<AnswerResponse[]> {
  const response = await apiClient.get<ApiResponse<AnswerResponse[]>>(
    `/api/sessions/${sessionId}/answers`
  )

  return response.data.data
}

export async function getAnswer(answerId: number): Promise<AnswerResponse> {
  const response = await apiClient.get<ApiResponse<AnswerResponse>>(
    `/api/answers/${answerId}`
  )

  return response.data.data
}

export async function getAnswerFeedbacks(
  answerId: number
): Promise<FeedbackResponse[]> {
  const response = await apiClient.get<ApiResponse<FeedbackResponse[]>>(
    `/api/answers/${answerId}/feedbacks`
  )

  return response.data.data
}

export async function submitAnswerWithFeedback(
  sessionId: number,
  payload: SubmitAnswerWithFeedbackPayload
): Promise<AnswerWithFeedbackResponse> {
  const formData = new FormData()

  formData.append('questionText', payload.questionText)
  formData.append('file', payload.file)
  appendOptionalNumber(formData, 'eyeContactScore', payload.eyeContactScore)
  appendOptionalNumber(formData, 'postureScore', payload.postureScore)
  appendOptionalString(formData, 'startedAt', payload.startedAt)
  appendOptionalString(formData, 'endedAt', payload.endedAt)

  const response = await apiClient.post<
    ApiResponse<AnswerWithFeedbackResponse>
  >(`/api/sessions/${sessionId}/answers/with-feedback`, formData, {
    headers: { 'Content-Type': undefined },
  })

  return response.data.data
}
