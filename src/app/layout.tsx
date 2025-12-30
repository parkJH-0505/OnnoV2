import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Onno - AI 미팅 어시스턴트',
  description: '회의 중 놓치는 것들, 이제 AI가 알아서 챙깁니다',
  keywords: ['미팅', 'AI', '회의록', '결정사항', '어시스턴트'],
  openGraph: {
    title: 'Onno - AI 미팅 어시스턴트',
    description: '회의 중 놓치는 것들, 이제 AI가 알아서 챙깁니다',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
