import { apiClient, type ApiResponse } from './client'
import type { AnswerWithFeedbackResponse } from '@/types/feedback'

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
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data
}
