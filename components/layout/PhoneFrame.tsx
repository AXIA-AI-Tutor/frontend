// 폰 목업 껍데기 — 내부 screen 콘텐츠를 children으로 받는다

interface PhoneFrameProps {
  isDark?: boolean
  children: React.ReactNode
}

export function PhoneFrame({ isDark = false, children }: PhoneFrameProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[48px] border-[9px] border-[#11131a] bg-[#0b0c12] p-[9px]"
      style={{
        width: 390,
        height: 812,
        boxShadow: '0 24px 60px rgba(0,0,0,.26)',
      }}
    >
      {/* 화면 */}
      <div className="relative h-full overflow-hidden rounded-[38px] bg-[#f8faff]">
        {/* 상단 노치 */}
        <div className="absolute left-1/2 top-0 z-[5] h-[30px] w-40 -translate-x-1/2 rounded-b-[20px] bg-[#11131a]" />

        {/* 상태바 */}
        <div
          className={`pointer-events-none absolute left-0 right-0 top-0 z-[4] flex justify-between px-5 pt-2.5 text-sm font-black ${isDark ? 'text-slate-800' : 'text-white'}`}
        >
          <span>9:41</span>
          <span className="tracking-wider text-xs">▮▮▮  ᯤ  ▰</span>
        </div>

        {children}
      </div>
    </div>
  )
}