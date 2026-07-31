'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCrmStore } from '@/lib/store'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: string
  timezone?: string
  team?: string
  department?: string
}

async function fetchMe(): Promise<AuthUser> {
  const res = await fetch('/api/auth/me')
  if (!res.ok) throw new Error('Unauthorized')
  const data = await res.json()
  return data.user
}

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const updateProfile = useCrmStore((s) => s.updateProfile)

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    if (query.data) {
      updateProfile({
        name: query.data.name,
        email: query.data.email,
        role: query.data.role,
        timezone: query.data.timezone ?? 'UTC',
      })
    }
  }, [query.data, updateProfile])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    queryClient.clear()
    router.push('/login')
    router.refresh()
  }

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    logout,
  }
}
