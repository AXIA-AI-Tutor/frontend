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

// ── 아래는 ReportScreen(대시보드) 전용 프로토타입 타입 ──────────────────────

export interface TurnChartPoint {
  x: number // SVG viewBox 기준 x 퍼센트
  y: number // SVG viewBox 기준 y 퍼센트
  label: string // 턴 레이블 (T1, T2, ...)
  msg: string // 포인트 클릭 메시지
}

// peerPercentile·previousDeltaScore·averageScore 등은 백엔드 미구현
export interface ReportSessionSummary {
  latestSessionDate: string
  score: number
  previousDeltaScore: number
  averageScore: number
  peerPercentile: number
}

export interface ReportData {
  summary: ReportSessionSummary
  strengths: string[]
  weaknesses: string[]
  improvementNote: string
  turnChartPoints: TurnChartPoint[]
}
