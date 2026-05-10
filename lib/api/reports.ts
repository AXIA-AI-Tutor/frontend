import { apiClient, type ApiResponse } from './client'
import type { ReportResponse } from '@/types/report'

export async function getSessionReport(
  sessionId: number
): Promise<ReportResponse> {
  const response = await apiClient.get<ApiResponse<ReportResponse>>(
    `/api/sessions/${sessionId}/report`
  )

  return response.data.data
}

export async function generateSessionReport(
  sessionId: number
): Promise<ReportResponse> {
  const response = await apiClient.post<ApiResponse<ReportResponse>>(
    `/api/sessions/${sessionId}/report/generate`
  )

  return response.data.data
}
