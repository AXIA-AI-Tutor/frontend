import { CoachAvatar } from '@/components/ui/CoachAvatar'

interface CoachAvatarLiveProps {
  question: string
}

export function CoachAvatarLive({ question }: CoachAvatarLiveProps) {
  return (
    <div className="relative mb-2.5 grid h-[190px] place-items-center overflow-hidden rounded-[18px] border border-slate-200 bg-gradient-to-b from-[#e9edff] to-[#dce7ff]">
      {/* 아바타 (1.5배 크기) */}
      <div className="relative top-7" style={{ transform: 'scale(1.5)' }}>
        <CoachAvatar />
      </div>
      {/* 말풍선 */}
      <div className="absolute right-3.5 top-9 w-[116px] rounded-[18px] bg-white p-3 text-[13px] font-black leading-snug shadow-md">
        {question}
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