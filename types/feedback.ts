// 백엔드: domain/answer 기반 (프론트엔드에서 '턴 피드백'으로 표시)

export interface FeedbackScore {
  label: string
  score: number
}

// 백엔드: domain/answer/entity/Answer — question/hint/topic은 AI 생성 예정
export interface TurnData {
  question: string
  hint: string
  topic: string
}

// 백엔드 미구현: AI 생성 피드백 구조 (향후 feedback 도메인 추가 예정)
export interface FeedbackData {
  answer: string // 백엔드: AnswerResponse.transcript
  summary: string // 한 줄 요약
  rationale: string[] // 근거 목록
  improvedExample: string // 개선 예시
  scores: FeedbackScore[] // 세부 점수 (5점 만점)
  durationLabel?: string // 답변 소요 시간 표시 (예: '00:42')
}
