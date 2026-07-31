'use client'

import { usePathname } from 'next/navigation'
import { AppShell } from './app-shell'

export function ConditionalAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/login') return <>{children}</>
  return <AppShell>{children}</AppShell>
}
