import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ConditionalAppShell } from '@/components/layout/conditional-app-shell'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'SalesPilot — Sales Dashboard CRM',
  description:
    'Revenue analytics, pipeline funnel, team leaderboards and product performance for modern sales organizations.',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#111417' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <Providers>
          <ConditionalAppShell>{children}</ConditionalAppShell>
          <Toaster position="bottom-right" />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
