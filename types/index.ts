export type Screen = 'home' | 'live' | 'feedback' | 'report'
export type Mode = '면접' | '발표'
export type Difficulty = '쉬움' | '보통' | '어려움'

export interface FeatureItem {
  icon: string
  title: string
  description: string
}

export interface ScreenData {
  crumb: string
  title: string
  text: string
  legend: string
  tip: string
  flow: [string, string, string][]
  interactions: [string, string, string][]
  features: [string, string, string][]
}