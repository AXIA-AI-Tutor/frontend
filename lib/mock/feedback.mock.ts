import type { FeedbackData } from '@/types/feedback'

const MOCK_FEEDBACK_LIST: FeedbackData[] = [
  {
    feedbackId: 1,
    answerId: 1,
    answer:
      '저는 사용자 문제를 구조적으로 파악하고 제품 경험으로 해결하는 데 강점이 있습니다. 이전 프로젝트에서 고객 문의 흐름을 분석해 반복 질문을 줄였고, 이런 경험을 바탕으로 서비스 개선에 기여하고 싶습니다.',
    summary:
      '회사·직무와의 연결은 좋지만, 구체적 경험과 기여 포인트가 더해지면 설득력이 크게 높아집니다.',
    evidence:
      '회사의 서비스/가치에 대한 이해가 드러나요.\n본인의 경험이 추상적이어서 차별성이 약해요.\n입사 후 기여 포인트가 명확하지 않아요.',
    improvedExample:
      '"데이터 기반 의사결정으로 고객 경험을 혁신하는 귀사의 방향에 공감했습니다. 학부 프로젝트에서 사용자 행동 데이터를 분석해 전환율을 18% 개선한 경험을 바탕으로 기여하고 싶습니다."',
    scores: [
      { label: '구조', score: 80 },
      { label: '구체성', score: 60 },
      { label: '관련성', score: 80 },
      { label: '전달력', score: 70 },
    ],
    durationLabel: '00:42',
    createdAt: '2026-05-05T10:02:10',
  },
  {
    feedbackId: 2,
    answerId: 2,
    answer:
      '최근 프로젝트에서는 사용자 리서치와 화면 설계 파트를 맡았습니다. 요구사항을 정리하고 우선순위를 조율해 핵심 기능을 먼저 출시했고, 이후 피드백을 반영해 사용성을 개선했습니다.',
    summary:
      '역할과 과정은 명확하지만, 구체적 수치나 기여한 성과를 추가하면 더욱 강해집니다.',
    evidence:
      '역할 분담과 과정이 논리적으로 설명되었어요.\n구체적인 성과 수치가 빠져 있어요.\n우선순위 조율 방법에 대한 구체적 사례가 있으면 좋아요.',
    improvedExample:
      '"사용자 인터뷰 5건을 통해 핵심 불편사항을 3가지로 압축했고, 이를 바탕으로 첫 출시 후 DAU를 30% 높이는 데 기여했습니다."',
    scores: [
      { label: '구조', score: 90 },
      { label: '구체성', score: 50 },
      { label: '관련성', score: 80 },
      { label: '전달력', score: 70 },
    ],
    durationLabel: '00:51',
    createdAt: '2026-05-05T10:04:30',
  },
  {
    feedbackId: 3,
    answerId: 3,
    answer:
      '평소 IT 기술을 활용해 사람들의 생활을 편리하게 만드는 일에 관심이 많았습니다. 귀사의 데이터 플랫폼은 다양한 산업에서 가치 있는 서비스를 제공하고 있어 이 곳에서 제 역량을 발휘하고 싶어 지원했습니다.',
    summary:
      '지원 동기가 진솔하게 표현되었지만, 본인의 구체적 역량과 연결되면 더욱 설득력이 높아집니다.',
    evidence:
      '지원 동기가 자연스럽게 전달되었어요.\n본인의 역량과 회사 연결이 추상적이에요.\n협업 갈등 해결 경험이 구체적이지 않아요.',
    improvedExample:
      '"팀원 간 기술 스택 의견 충돌 시, 각자의 장단점을 표로 정리해 공유하고 투표로 결정하는 방식을 제안해 합의를 이끌어낸 경험이 있습니다."',
    scores: [
      { label: '구조', score: 70 },
      { label: '구체성', score: 40 },
      { label: '관련성', score: 70 },
      { label: '전달력', score: 80 },
    ],
    durationLabel: '00:38',
    createdAt: '2026-05-05T10:07:20',
  },
]

export function getMockFeedbackData(turnNumber: number): FeedbackData {
  return MOCK_FEEDBACK_LIST[(turnNumber - 1) % MOCK_FEEDBACK_LIST.length]
}
