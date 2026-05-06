// 백엔드 미구현: report 도메인 추가 예정

export interface ReportTask {
  icon: string
  title: string
  sub: string
}

export interface TurnChartPoint {
  x: number // SVG viewBox 기준 x 퍼센트
  y: number // SVG viewBox 기준 y 퍼센트
  label: string // 턴 레이블 (T1, T2, ...)
  msg: string // 포인트 클릭 메시지
}

// 백엔드: SessionResponse 기반 (score 등은 AI 집계 예정)
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
  tasks: ReportTask[]
  memoryChips: string[]
  savedFeedbackPreview: string
  improvementNote: string
  turnChartPoints: TurnChartPoint[]
}
