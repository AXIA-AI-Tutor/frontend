import type { AvatarGender } from '@/lib/stores/avatar'

interface VoiceSelectionOptions {
  gender: AvatarGender
  preferredVoiceNames?: string[]
}

// female: Google 한국의(Chrome 네트워크 TTS) 우선, 없으면 macOS 로컬 폴백
// male: macOS Reed 우선 (브라우저에 한국어 남성 Google TTS 없음)
const GENDER_VOICE_HINTS: Record<AvatarGender, string[]> = {
  female: ['google 한국의', '유나', 'flo', 'sandy', 'shelley', 'grandma'],
  male: ['reed', 'rocko', 'eddy', 'grandpa'],
}

function isKoreanVoice(voice: SpeechSynthesisVoice) {
  const lang = voice.lang.toLowerCase()

  return lang === 'ko-kr' || lang.startsWith('ko')
}

function includesAnyHint(voice: SpeechSynthesisVoice, hints: string[]) {
  const name = voice.name.toLowerCase()

  return hints.some((hint) => name.includes(hint.toLowerCase()))
}

export function getAvatarSpeechVoice(
  speechSynthesis: SpeechSynthesis,
  { gender, preferredVoiceNames = [] }: VoiceSelectionOptions
) {
  const voices = speechSynthesis.getVoices()
  const koreanVoices = voices.filter(isKoreanVoice)
  const hints = [...preferredVoiceNames, ...GENDER_VOICE_HINTS[gender]]

  return (
    koreanVoices.find((voice) => includesAnyHint(voice, hints)) ??
    koreanVoices[0] ??
    null
  )
}

export function canUseBrowserSpeech() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}
