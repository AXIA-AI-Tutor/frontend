// 백엔드: domain/session/entity/SessionMode.java
export type SessionMode = 'INTERVIEW' | 'PRESENTATION'

// 백엔드: domain/session/entity/SessionDifficulty.java
export type SessionDifficulty = 'EASY' | 'NORMAL' | 'HARD'

// 백엔드: domain/session/entity/SessionTarget.java
export type SessionTarget =
  | 'BACKEND'
  | 'FRONTEND'
  | 'FULLSTACK'
  | 'AI_ML'
  | 'DATA'
  | 'DEVOPS'
  | 'MOBILE'
  | 'QA'

// 백엔드: domain/session/entity/SessionStatus.java
export type SessionStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

// 백엔드: domain/session/entity/SessionEventType.java
export type SessionEventType =
  | 'SESSION_CREATED'
  | 'SESSION_STARTED'
  | 'QUESTION_GENERATED'
  | 'ANSWER_SUBMITTED'
  | 'FEEDBACK_CREATED'
  | 'REPORT_CREATED'
  | 'SESSION_COMPLETED'
  | 'SESSION_FAILED'

// 백엔드: domain/session/dto/SessionResponse.java
export interface SessionResponse {
  id: number
  userId: number
  mode: SessionMode
  target: SessionTarget
  difficulty: SessionDifficulty
  answerTimeLimitSec: number
  status: SessionStatus
  startedAt: string
  completedAt: string | null
  createdAt: string
}

// 백엔드: domain/session/dto/SessionStartRequest.java
export interface SessionStartRequest {
  mode: SessionMode
  target: SessionTarget
  difficulty: SessionDifficulty
}

// 백엔드: global/ai/client/dto/AiQuestionGenerateResponse.java
export interface AiQuestionGenerateResponse {
  question_text?: string | null
  question_intent?: string | null
  tts_audio_url?: string | null
  latency_ms?: number | null
  fallback_components?: string[] | null
  questionText?: string | null
  questionIntent?: string | null
  ttsAudioUrl?: string | null
  latencyMs?: number | null
  fallbackComponents?: string[] | null
}

// 백엔드: domain/session/dto/SessionStartResponse.java
export interface SessionStartResponse {
  session: SessionResponse
  question: AiQuestionGenerateResponse
}
