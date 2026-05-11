import { CoachAvatar } from '@/components/ui/CoachAvatar'

interface CoachAvatarLiveProps {
  question: string
  hint?: string
  summary?: string | null
  speechType?: 'question' | 'feedback' | null
  compact?: boolean
  featured?: boolean
  expanded?: boolean
  fill?: boolean
  className?: string
}

export function CoachAvatarLive({
  question,
  hint,
  summary,
  speechType = null,
  compact = false,
  featured = false,
  expanded = false,
  fill = false,
  className,
}: CoachAvatarLiveProps) {
  const isFeedbackSpeech = speechType === 'feedback' && !!summary
  const containerClass = fill
    ? 'h-full rounded-lg'
    : featured
      ? 'min-h-[360px] rounded-lg lg:min-h-[560px] xl:min-h-[620px]'
      : expanded
        ? 'min-h-[320px] flex-1 rounded-lg'
        : compact
          ? 'h-[220px] rounded-lg'
          : 'mb-2.5 h-[230px] rounded-[18px]'
  const hasTopBubble = featured || expanded

  return (
    <div
      data-speech-type={speechType ?? undefined}
      className={[
        'relative grid place-items-center overflow-hidden border border-slate-200 bg-gradient-to-b from-[#e9edff] to-[#dce7ff] shadow-sm',
        containerClass,
        className,
      ].join(' ')}
    >
      {/* 아바타 (1.5배 크기) */}
      <div
        className={[
          'absolute',
          featured
            ? 'bottom-8 left-1/2 -translate-x-1/2 scale-[1.7] lg:bottom-10 lg:scale-[2]'
            : expanded
              ? 'bottom-5 left-1/2 -translate-x-1/2 scale-[1.25] lg:bottom-7 lg:scale-[1.45]'
              : compact
                ? 'bottom-4 left-10 scale-110'
                : 'bottom-3 left-9 scale-125',
        ].join(' ')}
      >
        <CoachAvatar />
      </div>
      {/* 말풍선 */}
      <div
        className={[
          'absolute rounded-[18px] bg-white p-3 text-[13px] font-black leading-snug shadow-md',
          featured
            ? 'left-1/2 top-6 w-[calc(100%-40px)] max-w-[460px] -translate-x-1/2 lg:top-8 lg:p-5 lg:text-base'
            : expanded
              ? 'left-1/2 top-6 w-[calc(100%-40px)] -translate-x-1/2 lg:top-7'
              : compact
                ? 'right-4 top-5 w-[190px]'
                : 'right-3.5 top-5 w-[180px]',
        ].join(' ')}
      >
        {isFeedbackSpeech ? (
          <p className="break-keep text-slate-700">{summary}</p>
        ) : (
          <>
            <p className="break-keep">{question}</p>
            {hint ? (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase text-blue-600">
                    Tip
                  </span>
                </div>
                <p className="mt-0.5 break-keep text-[11px] font-bold leading-snug text-slate-500">
                  {hint}
                </p>
              </div>
            ) : null}
          </>
        )}
        {/* 말풍선 꼬리 */}
        <span
          className={
            hasTopBubble
              ? 'absolute -bottom-2 left-10 border-solid border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-white'
              : 'absolute -left-2.5 top-9 border-solid border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-white'
          }
        />
      </div>
    </div>
  )
}
