import { subDays, subMonths } from 'date-fns'
import type { Prisma } from '@/lib/generated/prisma/client'
import type { DateRange, Filters } from './types'

export function normalizeFilters(params: URLSearchParams): Filters {
  const range = (params.get('range') ?? '30d') as DateRange
  return {
    range: (['7d', '30d', '90d', '12m'] as DateRange[]).includes(range) ? range : '30d',
    team: params.get('team') ?? 'All teams',
    department: params.get('department') ?? 'All departments',
    region: params.get('region') ?? 'All regions',
    product: params.get('product') ?? 'All products',
    source: params.get('source') ?? 'All sources',
  }
}

export function getDateRangeStart(range: DateRange): Date {
  const now = new Date()
  switch (range) {
    case '7d':
      return subDays(now, 7)
    case '30d':
      return subDays(now, 30)
    case '90d':
      return subDays(now, 90)
    case '12m':
      return subMonths(now, 12)
  }
}

export function buildDealWhere(filters: Filters): Prisma.DealWhereInput {
  const repFilter: Prisma.UserWhereInput = {}
  if (filters.team !== 'All teams') repFilter.team = filters.team
  if (filters.department !== 'All departments') repFilter.department = filters.department

  const where: Prisma.DealWhereInput = {
    createdAt: { gte: getDateRangeStart(filters.range) },
  }

  if (Object.keys(repFilter).length > 0) where.rep = repFilter
  if (filters.region !== 'All regions') where.region = filters.region
  if (filters.product !== 'All products') where.product = { name: filters.product }
  if (filters.source !== 'All sources') where.source = filters.source

  return where
}

export function buildActivityWhere(filters: Filters): Prisma.ActivityWhereInput {
  const repFilter: Prisma.UserWhereInput = {}
  if (filters.team !== 'All teams') repFilter.team = filters.team
  if (filters.department !== 'All departments') repFilter.department = filters.department

  const where: Prisma.ActivityWhereInput = {
    createdAt: { gte: getDateRangeStart(filters.range) },
  }

  if (Object.keys(repFilter).length > 0) where.user = repFilter

  return where
}
