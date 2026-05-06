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
  tasks: [
    {
      icon: '🎙',
      title: '구체적 사례 답변 연습',
      sub: 'STAR 기법으로 사례 구체화',
    },
    {
      icon: '◷',
      title: '답변 확장 연습',
      sub: '20초 → 45초 구조 확장',
    },
  ],
  memoryChips: [
    '선호 톤: 차분/신뢰감',
    '목표 직무: IT 기획',
    '반복 약점: 구체성 부족',
    '학습 목표: 논리적 구조 강화',
  ],
  savedFeedbackPreview: '결론을 먼저 말하는 연습이 좋아요!',
  improvementNote: '논리적 구조와 답변 길이가 크게 개선되었어요.',
  turnChartPoints: MOCK_TURN_CHART_POINTS,
}
