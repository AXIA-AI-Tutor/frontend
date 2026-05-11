import type { AvatarGender } from '@/lib/stores/avatar'

interface VoiceSelectionOptions {
  gender: AvatarGender
  preferredVoiceNames?: string[]
}

const GENDER_VOICE_HINTS: Record<AvatarGender, string[]> = {
  female: ['female', 'yuna', 'sora', 'seoyeon', 'sunhi', 'heami'],
  male: ['male', 'injoon', 'hyunsu'],
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
    voices.find((voice) => includesAnyHint(voice, hints)) ??
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
