'use client'

import { useAuth } from '@/lib/auth-client'

/** Loads the authenticated user into client state on dashboard pages. */
export function AuthBootstrap() {
  useAuth()
  return null
}
