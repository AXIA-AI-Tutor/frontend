'use client'

import { create } from 'zustand'

import type {
  AiQuestionGenerateResponse,
  SessionStartResponse,
} from '@/types/session'

interface PracticeSessionState {
  sessionStart: SessionStartResponse | null
  questionByTurn: Record<number, AiQuestionGenerateResponse>
  maxQuestionCount: number
  setSessionStart: (sessionStart: SessionStartResponse) => void
  setTurnQuestion: (
    turn: number,
    question: AiQuestionGenerateResponse,
    maxCount: number
  ) => void
  clearSessionStart: () => void
}

export const usePracticeSessionStore = create<PracticeSessionState>((set) => ({
  sessionStart: null,
  questionByTurn: {},
  maxQuestionCount: 0,
  setSessionStart: (sessionStart) => set({ sessionStart }),
  setTurnQuestion: (turn, question, maxCount) =>
    set((state) => ({
      questionByTurn: { ...state.questionByTurn, [turn]: question },
      maxQuestionCount: maxCount,
    })),
  clearSessionStart: () =>
    set({ sessionStart: null, questionByTurn: {}, maxQuestionCount: 0 }),
}))
