import { CheckCircle2, Clock3, Loader2, MessageSquareText } from 'lucide-react'

import { cn } from '@/lib/utils'

export type TurnFeedbackStatus = 'in-progress' | 'generating' | 'ready'

interface TurnFeedbackCardProps {
  status: TurnFeedbackStatus
  turnNumber: number
  onOpen: () => void
}

const STATUS_COPY: Record<
  TurnFeedbackStatus,
  {
    title: string
    description: string
    badge: string
  }
> = {
  'in-progress': {
    title: '피드백 대기 중',
    description: '현재 질문을 마치면 답변 구조와 전달력을 분석합니다.',
    badge: '답변 진행',
  },
  generating: {
    title: '피드백 생성 중',
    description: '답변 내용을 정리하고 개선 포인트를 만들고 있습니다.',
    badge: '분석 중',
  },
  ready: {
    title: '피드백 준비 완료',
    description: '한 줄 요약, 근거, 개선 예시를 확인할 수 있습니다.',
    badge: '열람 가능',
  },
}

export function TurnFeedbackCard({
  status,
  turnNumber,
  onOpen,
}: TurnFeedbackCardProps) {
  const copy = STATUS_COPY[status]
  const isReady = status === 'ready'
  const isGenerating = status === 'generating'

  return (
    <section className="mb-2.5 rounded-[18px] border border-slate-200 bg-white p-3.5 shadow-sm lg:mb-0 lg:rounded-lg lg:p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-lg',
            isReady
              ? 'bg-emerald-50 text-emerald-600'
              : isGenerating
                ? 'bg-blue-50 text-blue-600'
                : 'bg-slate-100 text-slate-500'
          )}
        >
          {isReady ? (
            <CheckCircle2 size={20} />
          ) : isGenerating ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Clock3 size={20} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-sm font-black text-slate-950">
              턴 {turnNumber} {copy.title}
            </h3>
            {isReady ? (
              <button
                type="button"
                onClick={onOpen}
                className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-full bg-emerald-50 px-2.5 text-[11px] font-black text-emerald-600 transition-colors hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                aria-label={`턴 ${turnNumber} 피드백 보기`}
              >
                <MessageSquareText size={12} />
                피드백 보기
              </button>
            ) : (
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black',
                  isGenerating
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                {copy.badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
            {copy.description}
          </p>
        </div>
      </div>
    </section>
  )
}
