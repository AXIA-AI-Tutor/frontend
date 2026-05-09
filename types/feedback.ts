import type { AnswerResponse } from '@/types/answer'

// 백엔드 도메인명: feedback (프론트엔드에서 '질문 피드백'으로 표시)

export type FeedbackSource = 'live' | 'report'

// 백엔드: domain/feedback/dto/FeedbackResponse.java
export interface FeedbackResponse {
  feedbackId: number
  answerId: number
  summary: string | null
  evidence: string | null
  improvementExample: string | null
  structureScore: number | null
  specificityScore: number | null
  relevanceScore: number | null
  deliveryScore: number | null
  createdAt: string
}

// 백엔드: domain/answer/dto/AnswerWithFeedbackResponse.java
export interface AnswerWithFeedbackResponse {
  answer: AnswerResponse
  feedback: FeedbackResponse
}

export interface FeedbackScore {
  label: string
  score: number | null
}

// 백엔드: domain/answer/entity/Answer — question/hint/topic은 AI 생성 예정
export interface TurnData {
  question: string
  hint: string
  topic: string
}

// FeedbackScreen 표시 모델: AnswerResponse + FeedbackResponse 조합을 화면에 맞게 정규화
export interface FeedbackData {
  feedbackId?: number
  answerId?: number
  createdAt?: string
  answer: string | null // 백엔드: AnswerResponse.transcript
  summary: string | null
  evidence: string | null
  improvedExample: string | null
  scores: FeedbackScore[] // 백엔드 점수 범위: 0~100
  durationLabel?: string // 답변 소요 시간 표시 (예: '00:42')
}
