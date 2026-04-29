'use client'

interface HintCardProps {
  onClick?: () => void
}

export function HintCard({ onClick }: HintCardProps) {
  return (
    <button
      onClick={onClick}
      className="mb-2.5 flex w-full items-center gap-[11px] rounded-[18px] border border-indigo-200 bg-gradient-to-r from-purple-50 to-blue-50 p-[13px] text-left"
    >
      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[14px] bg-white text-purple-700 shadow-sm">
        💡
      </span>
      <div>
        <b className="text-[13px] text-indigo-700">
          현재 힌트{' '}
          <span className="float-right rounded-full bg-white px-2 py-0.5 text-[10px]">
            적용해보세요
          </span>
        </b>
        <p className="mt-0.5 text-[12px] leading-snug text-slate-600">
          성과는 구체적인 수치(%, 금액, 기간 등)로 제시하면 신뢰도가 높아져요.
        </p>
      </div>
    </button>
  )
}
