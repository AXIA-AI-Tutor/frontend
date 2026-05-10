import type { SessionResponse } from '@/types/session'

// 백엔드: domain/report/dto/ReportResponse.java
export interface ReportResponse {
  reportId: number
  sessionId: number
  totalScore: number | null
  strengths: string | null // text, 파싱 포맷 백엔드 합의 필요
  improvements: string | null
  createdAt: string
}

export type ReportAvailabilityStatus =
  | 'READY'
  | 'MISSING'
  | 'GENERATING'
  | 'FAILED'

// ReportListScreen용 세션-리포트 묶음 타입
export interface ReportListItem {
  session: SessionResponse
  report: ReportResponse | null
  reportStatus?: ReportAvailabilityStatus
}

// ReportScreen 차트용 질문별 포인트 타입
export interface TurnChartPoint {
  x: number // SVG viewBox 기준 x 퍼센트
  y: number // SVG viewBox 기준 y 퍼센트
  label: string // 질문 레이블 (Q1, Q2, ...)
  msg: string // 포인트 클릭 메시지
}
