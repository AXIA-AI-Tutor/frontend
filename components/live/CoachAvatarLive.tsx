import { CoachAvatar } from '@/components/ui/CoachAvatar'
import { useMouthCue } from '@/lib/hooks/useMouthCue'
import type { AvatarGender } from '@/lib/stores/avatar'

interface CoachAvatarLiveProps {
  question: string
  hint?: string
  summary?: string | null
  gender?: AvatarGender
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
  gender = 'female',
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

  const speakingText =
    speechType === 'question'
      ? question
      : speechType === 'feedback' && summary
        ? summary
        : null
  const mouthShape = useMouthCue(speakingText, speechType !== null)

  return (
    <div
      data-speech-type={speechType ?? undefined}
      className={[
        'relative overflow-hidden border border-slate-200 bg-linear-to-b from-[#e9edff] to-[#dce7ff] shadow-sm',
        containerClass,
        className,
      ].join(' ')}
    >
      {/* 아바타 이미지 */}
      <div className="absolute inset-0">
        <CoachAvatar gender={gender} mouthShape={mouthShape} />
      </div>

      {/* 말풍선 */}
      <div
        className={[
          'absolute rounded-[18px] bg-white p-3 text-[13px] font-black leading-snug shadow-md',
          featured
            ? 'left-1/2 top-6 w-[calc(100%-40px)] max-w-115 -translate-x-1/2 lg:top-8 lg:p-5 lg:text-base'
            : expanded
              ? 'left-1/2 top-6 w-[calc(100%-40px)] -translate-x-1/2 lg:top-7'
              : compact
                ? 'right-4 top-5 w-47.5'
                : 'right-3.5 top-5 w-45',
        ].join(' ')}
      >
        {isFeedbackSpeech ? (
          <>
            <span className="mb-1.5 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-600">
              한 줄 요약
            </span>
            <p className="break-keep text-[13px] font-bold leading-snug text-slate-700">
              {summary}
            </p>
          </>
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
