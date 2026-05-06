// 백엔드 미구현: report 도메인 추가 예정
import type { ReportData, TurnChartPoint } from '@/types/report'

const MOCK_TURN_CHART_POINTS: TurnChartPoint[] = [
  { x: 18, y: 57, label: 'T1', msg: 'T1: 구조는 좋지만 예시 부족' },
  { x: 48, y: 35, label: 'T2', msg: 'T2: 구체성이 개선됨' },
  { x: 80, y: 18, label: 'T3', msg: 'T3: 종합 점수 82점' },
]

export const MOCK_REPORT_DATA: ReportData = {
  summary: {
    latestSessionDate: '2026. 05. 05',
    score: 82,
    previousDeltaScore: 12,
    averageScore: 78,
    peerPercentile: 23,
  },
  strengths: ['논리적 구조', '전달력 유지', '핵심 키워드 사용'],
  weaknesses: ['구체성 부족', '답변 길이 편차', '전환 표현 어색함'],
  improvementNote: '논리적 구조와 답변 길이가 크게 개선되었어요.',
  turnChartPoints: MOCK_TURN_CHART_POINTS,
}
