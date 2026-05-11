export type MouthShape = 'closed' | 'open' | 'open_big'

// 중성(모음) 인덱스 → 입 모양
// open_big: ㅏ(0) ㅑ(2) ㅗ(8) ㅘ(9) ㅙ(10) ㅛ(12)
const OPEN_BIG_JUNGSEONG = new Set([0, 2, 8, 9, 10, 12])

const MS_PER_SYLLABLE = 240 // rate 0.9 기준 약 4음절/초
const MS_SPACE = 80
const MS_PAUSE_SHORT = 280 // 쉼표
const MS_PAUSE_LONG = 480 // 마침표·느낌표·물음표

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
      schedule.push({ shape: getVowelShape(getJungseongIndex(code)), delay })
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
      delay += Math.floor(MS_PER_SYLLABLE * 0.7)
    }
  }

  schedule.push({ shape: 'closed', delay })
  return schedule
}
