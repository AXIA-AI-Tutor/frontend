export type MouthShape = 'closed' | 'open' | 'open_big'

// 중성(모음) 인덱스 → 입 모양
// open_big: ㅏ(0) ㅑ(2) ㅗ(8) ㅘ(9) ㅙ(10) ㅛ(12)
const OPEN_BIG_JUNGSEONG = new Set([0, 2, 8, 9, 10, 12])

const MS_PER_SYLLABLE = 180 // rate 0.9 기준 약 5.5음절/초
const MS_MID_CLOSE = 90 // 음절 중간 닫힘 (open → closed 리듬)
const MS_SPACE = 60
const MS_PAUSE_SHORT = 220 // 쉼표
const MS_PAUSE_LONG = 380 // 마침표·느낌표·물음표

function isKoreanSyllable(code: number): boolean {
  return code >= 0xac00 && code <= 0xd7a3
}

function getJungseongIndex(code: number): number {
  return Math.floor(((code - 0xac00) % (21 * 28)) / 28)
}

function getVowelShape(jungseongIdx: number): MouthShape {
  return OPEN_BIG_JUNGSEONG.has(jungseongIdx) ? 'open_big' : 'open'
}

export interface MouthCueEntry {
  shape: MouthShape
  delay: number
}

export function buildMouthCueSchedule(text: string): MouthCueEntry[] {
  const schedule: MouthCueEntry[] = []
  let delay = 0

  for (const char of text) {
    const code = char.charCodeAt(0)

    if (isKoreanSyllable(code)) {
      const shape = getVowelShape(getJungseongIndex(code))
      // 음절 시작: 입 열기
      schedule.push({ shape, delay })
      // 음절 중간: 살짝 닫기 → 연속 음절도 시각적으로 구분됨
      schedule.push({ shape: 'closed', delay: delay + MS_MID_CLOSE })
      delay += MS_PER_SYLLABLE
    } else if (char === ' ') {
      delay += MS_SPACE
    } else if (/[,，]/.test(char)) {
      schedule.push({ shape: 'closed', delay })
      delay += MS_PAUSE_SHORT
    } else if (/[.!?。！？\n]/.test(char)) {
      schedule.push({ shape: 'closed', delay })
      delay += MS_PAUSE_LONG
    } else if (/[a-zA-Z0-9]/.test(char)) {
      schedule.push({ shape: 'open', delay })
      schedule.push({ shape: 'closed', delay: delay + MS_MID_CLOSE })
      delay += Math.floor(MS_PER_SYLLABLE * 0.7)
    }
  }

  schedule.push({ shape: 'closed', delay })
  return schedule
}
