import { CoachAvatar } from '@/components/ui/CoachAvatar'
import { useMouthCue } from '@/lib/hooks/useMouthCue'
import type { AvatarGender } from '@/lib/stores/avatar'

interface CoachAvatarLiveProps {
  question: string
  hint?: string
  summary?: string | null
  gender?: AvatarGender
  speechType?: 'question' | 'feedback' | null
  guideMessage?: string | null
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
  guideMessage = null,
  compact = false,
  featured = false,
  expanded = false,
  fill = false,
  className,
}: CoachAvatarLiveProps) {
  const containerClass = fill
    ? 'h-full rounded-lg'
    : featured
      ? 'min-h-[360px] rounded-lg lg:min-h-[560px] xl:min-h-[620px]'
      : expanded
        ? 'min-h-[320px] flex-1 rounded-lg'
        : compact
          ? 'h-[220px] rounded-lg'
          : 'mb-2.5 h-[230px] rounded-[18px]'

  const speakingText =
    speechType === 'question'
      ? question
      : speechType === 'feedback' && summary
        ? summary
        : null
  const mouthShape = useMouthCue(speakingText, speechType !== null)

  const showGuide = !!guideMessage && speechType === null
  const isFeedbackSpeech = featured && speechType === 'feedback' && !!summary

  return (
    <div
      data-speech-type={speechType ?? undefined}
      className={[
        'relative border border-slate-200 shadow-sm',
        compact || fill
          ? 'overflow-hidden bg-linear-to-b from-[#e9edff] to-[#dce7ff]'
          : 'overflow-visible bg-transparent',
        containerClass,
        className,
      ].join(' ')}
    >
      {/* 아바타 이미지 */}
      <div
        className={[
          'absolute inset-0 bg-linear-to-b from-[#e9edff] to-[#dce7ff]',
          compact || fill ? '' : 'overflow-hidden rounded-lg',
        ].join(' ')}
      >
        <CoachAvatar gender={gender} mouthShape={mouthShape} />
      </div>

      {/* compact — 안내 문구 말풍선 */}
      {compact && showGuide && (
        <div className="absolute right-3.5 top-5 max-w-45 rounded-[18px] bg-white p-3 text-[12px] font-black leading-snug shadow-md">
          {guideMessage}
          <span className="absolute -left-2.5 top-6 border-solid border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-12 border-r-white" />
        </div>
      )}

      {/* expanded — 안내 문구 말풍선 (데스크탑 사이드바) */}
      {expanded && showGuide && (
        <div className="absolute left-1/2 top-4 w-[85%] -translate-x-1/2 rounded-[18px] bg-white p-3 text-[12px] font-black leading-snug shadow-md">
          {guideMessage}
          <span className="absolute -bottom-2 left-10 border-solid border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-white" />
        </div>
      )}

      {/* featured — 질문 말풍선 (답변 중 포함, 안내 문구·피드백 없을 때) */}
      {featured && !showGuide && !isFeedbackSpeech && (
        <div className="absolute left-1/2 top-1 w-4/5 -translate-x-1/2 rounded-[18px] bg-white p-3 text-[13px] font-black leading-snug shadow-md lg:top-2 lg:p-5 lg:text-base">
          <p className="break-keep">{question}</p>
          {hint ? (
            <div className="mt-2 border-t border-slate-100 pt-2">
              <span className="text-[10px] font-black uppercase text-blue-600">
                Tip
              </span>
              <p className="mt-0.5 break-keep text-[11px] font-bold leading-snug text-slate-500">
                {hint}
              </p>
            </div>
          ) : null}
          <span className="absolute -bottom-2 left-10 border-solid border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-white" />
        </div>
      )}

      {/* featured — 피드백 한 줄 요약 말풍선 */}
      {isFeedbackSpeech && (
        <div className="absolute left-1/2 top-1 w-4/5 -translate-x-1/2 rounded-[18px] bg-white px-3 py-2 text-[13px] font-black leading-snug shadow-md lg:top-2 lg:px-5 lg:py-3 lg:text-base">
          <span className="mb-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-600">
            한 줄 요약
          </span>
          <p className="break-keep text-[13px] font-bold leading-snug text-slate-700">
            {summary}
          </p>
          <span className="absolute -bottom-2 left-10 border-solid border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-white" />
        </div>
      )}

      {/* featured — TTS 종료 후 안내 문구 말풍선 */}
      {featured && showGuide && (
        <div className="absolute left-1/2 top-1 -translate-x-1/2 rounded-[18px] bg-white px-4 py-3 text-[13px] font-black leading-snug shadow-md lg:top-2">
          {guideMessage}
          <span className="absolute -bottom-2 left-10 border-solid border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-white" />
        </div>
      )}
    </div>
  )
}
