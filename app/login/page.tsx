import type { Metadata } from 'next'

import { LoginScreen } from '@/components/auth/LoginScreen'

export const metadata: Metadata = {
  title: '로그인 | AI 코치',
  description: 'AI 코치 로그인',
}

export default function LoginPage() {
  return <LoginScreen />
}
