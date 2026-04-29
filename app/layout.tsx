import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 코치 앱',
  description: 'AI 코치 앱 인터랙티브 UI/UX 프로토타입',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
