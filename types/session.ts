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
