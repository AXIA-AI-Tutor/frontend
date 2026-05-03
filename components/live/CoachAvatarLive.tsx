import { CoachAvatar } from '@/components/ui/CoachAvatar'

interface CoachAvatarLiveProps {
  question: string
  hint?: string
  onHintApply?: () => void
  compact?: boolean
}

export function CoachAvatarLive({
  question,
  hint,
  onHintApply,
  compact = false,
}: CoachAvatarLiveProps) {
  return (
    <div
      className={[
        'relative grid place-items-center overflow-hidden border border-slate-200 bg-gradient-to-b from-[#e9edff] to-[#dce7ff] shadow-sm',
        compact ? 'h-[220px] rounded-lg' : 'mb-2.5 h-[230px] rounded-[18px]',
      ].join(' ')}
    >
      {/* 아바타 (1.5배 크기) */}
      <div
        className={
          compact
            ? 'absolute bottom-4 left-10 scale-110'
            : 'absolute bottom-3 left-9 scale-125'
        }
      >
        <CoachAvatar />
      </div>
      {/* 말풍선 */}
      <div
        className={[
          'absolute rounded-[18px] bg-white p-3 text-[13px] font-black leading-snug shadow-md',
          compact ? 'right-4 top-5 w-[190px]' : 'right-3.5 top-5 w-[180px]',
        ].join(' ')}
      >
        <p className="break-keep">{question}</p>
        {hint ? (
          <div className="mt-2 border-t border-slate-100 pt-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-blue-600">
                Tip
              </span>
              {onHintApply ? (
                <button
                  type="button"
                  onClick={onHintApply}
                  className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-600 transition-colors hover:bg-blue-100"
                >
                  적용
                </button>
              ) : null}
            </div>
            <p className="mt-0.5 break-keep text-[11px] font-bold leading-snug text-slate-500">
              {hint}
            </p>
          </div>
        ) : null}
        {/* 말풍선 꼬리 */}
        <span
          className="absolute -left-2.5 top-9"
          style={{
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '12px solid white',
          }}
        />
      </div>
    </div>
  )
}
