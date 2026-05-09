// 백엔드 도메인명: answer (프론트엔드에서 '질문별 답변'으로 표시)

// 백엔드: domain/answer/entity/SttStatus.java
export type SttStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

// 백엔드: domain/answer/dto/AnswerResponse.java
export interface AnswerResponse {
  answerId: number
  sessionId: number
  questionText: string
  transcript: string | null
  durationSec: number | null
  speechRate: number | null
  silenceCount: number | null
  fillerWordCount: number | null
  eyeContactScore: number | null
  postureScore: number | null
  sttStatus: SttStatus
  startedAt: string
  endedAt: string | null
  createdAt: string
}
