'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFilters } from './store'
import type { Filters, FunnelData, OverviewData, ProductsData, RevenueData, TeamData } from './types'

export type DealRecord = {
  id: string
  title: string
  amount: number
  stage: string
  source: string
  region: string
  repId: string
  productId: string
  createdAt: string
  rep?: { id: string; name: string; team: string; department: string }
  product?: { id: string; name: string; category: string }
}

export type CreateDealInput = {
  title: string
  amount: number
  source: string
  region: string
  productId: string
  stage?: string
  repId?: string
}

function toQueryString(filters: Filters) {
  return new URLSearchParams(filters as unknown as Record<string, string>).toString()
}

async function fetchJson<T>(path: string, filters: Filters): Promise<T> {
  const response = await fetch(`${path}?${toQueryString(filters)}`)
  if (!response.ok) throw new Error(`Request to ${path} failed with ${response.status}`)
  return response.json() as Promise<T>
}

export function useOverview() {
  const filters = useFilters()
  return useQuery({
    queryKey: ['overview', filters],
    queryFn: () => fetchJson<OverviewData>('/api/overview', filters),
  })
}

export function useRevenue() {
  const filters = useFilters()
  return useQuery({
    queryKey: ['revenue', filters],
    queryFn: () => fetchJson<RevenueData>('/api/revenue', filters),
  })
}

export function useTeam() {
  const filters = useFilters()
  return useQuery({
    queryKey: ['team', filters],
    queryFn: () => fetchJson<TeamData>('/api/team', filters),
  })
}

export function useFunnel() {
  const filters = useFilters()
  return useQuery({
    queryKey: ['funnel', filters],
    queryFn: () => fetchJson<FunnelData>('/api/funnel', filters),
  })
}

export function useProducts() {
  const filters = useFilters()
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchJson<ProductsData>('/api/products', filters),
  })
}

export function useDeals() {
  const filters = useFilters()
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: async () => {
      const response = await fetch(`/api/deals?${toQueryString(filters)}`)
      if (!response.ok) throw new Error('Failed to fetch deals')
      const data = await response.json()
      return data.deals as DealRecord[]
    },
  })
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateDealInput) => {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error('Failed to create deal')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['overview'] })
      queryClient.invalidateQueries({ queryKey: ['funnel'] })
    },
  })
}

export function useUpdateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Partial<CreateDealInput>) => {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!response.ok) throw new Error('Failed to update deal')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['overview'] })
      queryClient.invalidateQueries({ queryKey: ['funnel'] })
    },
  })
}

export function useDeleteDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/deals/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete deal')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['overview'] })
    },
  })
}
