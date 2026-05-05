export const LIVE_TURNS = [
  {
    question: '자기소개와 지원 동기를 1분 안에 말해보세요.',
    hint: '성과는 구체적인 수치(%, 금액, 기간 등)로 제시하면 신뢰도가 높아져요.',
    topic: '자기소개와 지원 동기',
  },
  {
    question: '최근 프로젝트에서 맡았던 역할과 성과를 설명해 주세요.',
    hint: '상황, 맡은 일, 실행한 행동, 결과 순서로 답변하면 흐름이 선명해져요.',
    topic: '프로젝트 역할과 성과',
  },
  {
    question: '협업 중 의견 충돌을 해결했던 경험을 말해보세요.',
    hint: '상대의 관점을 어떻게 확인했고 합의점을 어떻게 만들었는지 포함해보세요.',
    topic: '협업 갈등 해결',
  },
] as const

export function getLiveTurn(turnNumber: number) {
  return LIVE_TURNS[(turnNumber - 1) % LIVE_TURNS.length]
}
