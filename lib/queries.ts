'use client'

import { useQuery } from '@tanstack/react-query'
import { useFilters } from './store'
import type { Filters, FunnelData, OverviewData, ProductsData, RevenueData, TeamData } from './types'

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
