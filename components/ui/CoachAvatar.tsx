// 홈, 실시간 연습, 피드백, 리포트 화면에서 공통으로 사용하는 아바타 CSS 컴포넌트

export function CoachAvatar({ scale = 1 }: { scale?: number }) {
  return (
    <div
      className="relative"
      style={{ width: 100 * scale, height: 118 * scale }}
    >
      {/* 머리카락 */}
      <span
        className="absolute rounded-[44px_44px_28px_28px]"
        style={{
          left: 14 * scale,
          top: 4 * scale,
          width: 72 * scale,
          height: 74 * scale,
          background: 'linear-gradient(135deg,#251d21,#5d4143)',
        }}
      />
      {/* 얼굴 */}
      <span
        className="absolute"
        style={{
          left: 26 * scale,
          top: 20 * scale,
          width: 48 * scale,
          height: 55 * scale,
          borderRadius: '45% 45% 46% 46%',
          background: '#ffdacc',
        }}
      >
        {/* 눈 */}
        <span
          className="absolute"
          style={{
            top: 23 * scale,
            left: 11 * scale,
            fontSize: 13 * scale,
            color: '#1a1a22',
          }}
        >
          •&nbsp;&nbsp;&nbsp;•
        </span>
        {/* 입 */}
        <span
          className="absolute rounded-[0_0_10px_10px]"
          style={{
            left: 20 * scale,
            top: 39 * scale,
            width: 9 * scale,
            height: 4 * scale,
            borderBottom: `2px solid #c85a63`,
          }}
        />
      </span>
      {/* 몸 */}
      <span
        className="absolute rounded-[18px_18px_0_0]"
        style={{
          left: 10 * scale,
          bottom: 0,
          width: 80 * scale,
          height: 55 * scale,
          background: 'linear-gradient(135deg,#94bdfb,#c4d8ff)',
        }}
      >
        {/* 넥타이 */}
        <span
          className="absolute"
          style={{
            left: 33 * scale,
            top: 0,
            borderLeft: `${12 * scale}px solid transparent`,
            borderRight: `${12 * scale}px solid transparent`,
            borderTop: `${30 * scale}px solid #fff`,
          }}
        />
      </span>
    </div>
  )
}
