// 홈, 실시간 연습, 피드백, 리포트 화면에서 공통으로 사용하는 아바타 CSS 컴포넌트

export function CoachAvatar({ scale = 1 }: { scale?: number }) {
  return (
    <>
      {/* tailwind 사용 불가 : scale prop 기반 동적 픽셀 계산 (width, height) */}
      <div
        className="relative"
        style={{ width: 100 * scale, height: 118 * scale }}
      >
        {/* 머리카락 */}
        {/* tailwind 사용 불가 : scale prop 기반 동적 픽셀 계산 (left, top, width, height) */}
        <span
          className="absolute rounded-[44px_44px_28px_28px] bg-[linear-gradient(135deg,#251d21,#5d4143)]"
          style={{
            left: 14 * scale,
            top: 4 * scale,
            width: 72 * scale,
            height: 74 * scale,
          }}
        />
        {/* 얼굴 */}
        {/* tailwind 사용 불가 : scale prop 기반 동적 픽셀 계산 (left, top, width, height) */}
        <span
          className="absolute rounded-[45%_45%_46%_46%] bg-[#ffdacc]"
          style={{
            left: 26 * scale,
            top: 20 * scale,
            width: 48 * scale,
            height: 55 * scale,
          }}
        >
          {/* 눈 */}
          {/* tailwind 사용 불가 : scale prop 기반 동적 픽셀 계산 (top, left, fontSize) */}
          <span
            className="absolute text-[#1a1a22]"
            style={{
              top: 23 * scale,
              left: 11 * scale,
              fontSize: 13 * scale,
            }}
          >
            •&nbsp;&nbsp;&nbsp;•
          </span>
          {/* 입 */}
          {/* tailwind 사용 불가 : scale prop 기반 동적 픽셀 계산 (left, top, width, height) */}
          <span
            className="absolute rounded-[0_0_10px_10px] [border-bottom:2px_solid_#c85a63]"
            style={{
              left: 20 * scale,
              top: 39 * scale,
              width: 9 * scale,
              height: 4 * scale,
            }}
          />
        </span>
        {/* 몸 */}
        {/* tailwind 사용 불가 : scale prop 기반 동적 픽셀 계산 (left, width, height) */}
        <span
          className="absolute bottom-0 rounded-[18px_18px_0_0] bg-[linear-gradient(135deg,#94bdfb,#c4d8ff)]"
          style={{
            left: 10 * scale,
            width: 80 * scale,
            height: 55 * scale,
          }}
        >
          {/* 넥타이 */}
          {/* tailwind 사용 불가 : scale prop 기반 동적 픽셀 계산 (left, border 크기) */}
          <span
            className="absolute top-0"
            style={{
              left: 33 * scale,
              borderLeft: `${12 * scale}px solid transparent`,
              borderRight: `${12 * scale}px solid transparent`,
              borderTop: `${30 * scale}px solid #fff`,
            }}
          />
        </span>
      </div>
    </>
  )
}
