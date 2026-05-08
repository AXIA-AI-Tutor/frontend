'use client'

import { create } from 'zustand'

import type { AnswerWithFeedbackResponse } from '@/types/feedback'

export interface TurnFeedbackEntry {
  questionText: string
  questionIntent: string | null
  response: AnswerWithFeedbackResponse
}

interface TurnFeedbackState {
  byTurn: Record<number, TurnFeedbackEntry>
  setTurnFeedback: (turn: number, entry: TurnFeedbackEntry) => void
  clear: () => void
}

export const useTurnFeedbackStore = create<TurnFeedbackState>((set) => ({
  byTurn: {},
  setTurnFeedback: (turn, entry) =>
    set((state) => ({ byTurn: { ...state.byTurn, [turn]: entry } })),
  clear: () => set({ byTurn: {} }),
}))
