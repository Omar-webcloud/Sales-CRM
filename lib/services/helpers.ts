import { format, subDays, subMonths, subWeeks } from 'date-fns'
import type { DealStage } from '@/lib/generated/prisma/client'
import type { Filters, Kpi } from '@/lib/types'

export const STAGE_LABELS: Record<DealStage, string> = {
  LEADS: 'Leads',
  CONTACTED: 'Contacted',
  DEMO: 'Demo',
  PROPOSAL: 'Proposal',
  WON: 'Won',
  LOST: 'Lost',
}

export const STAGE_ORDER: DealStage[] = ['LEADS', 'CONTACTED', 'DEMO', 'PROPOSAL', 'WON']

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

export function money(n: number) {
  return Math.round(n / 100) * 100
}

export function buildKpi(
  id: string,
  label: string,
  value: number,
  fmt: Kpi['format'],
  delta: number,
  sparkValues: number[],
): Kpi {
  return {
    id,
    label,
    value,
    format: fmt,
    delta,
    spark: sparkValues.map((v, i) => ({ i, v })),
  }
}

export function trendBucketKey(date: Date, filters: Filters) {
  return filters.range === '12m' ? format(date, 'MMM yyyy') : format(date, 'MMM d')
}

export function previousPeriodDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export function monthBuckets(count: number) {
  return Array.from({ length: count }, (_, idx) => {
    const d = subMonths(new Date(), count - 1 - idx)
    return { date: d, label: format(d, 'MMM') }
  })
}

export function weekBuckets(count: number) {
  return Array.from({ length: count }, (_, idx) => {
    const d = subWeeks(new Date(), count - 1 - idx)
    return { date: d, label: `W${format(d, 'w')}` }
  })
}

export function dayBuckets(filters: Filters) {
  const points = filters.range === '7d' ? 7 : filters.range === '30d' ? 30 : filters.range === '90d' ? 90 : 12
  if (filters.range === '12m') {
    return monthBuckets(points).map((b) => ({ date: b.date, label: b.label }))
  }
  return Array.from({ length: points }, (_, idx) => {
    const d = subDays(new Date(), points - 1 - idx)
    return { date: d, label: format(d, 'MMM d') }
  })
}

export function aggregateByBucket<T extends { createdAt: Date; amount: number }>(
  items: T[],
  buckets: { date: Date; label: string }[],
  monthly: boolean,
) {
  return buckets.map((bucket) => {
    const next = monthly
      ? subMonths(bucket.date, -1)
      : new Date(bucket.date.getFullYear(), bucket.date.getMonth(), bucket.date.getDate() + 1)
    const revenue = items
      .filter((d) => d.createdAt >= bucket.date && d.createdAt < next)
      .reduce((sum, d) => sum + d.amount, 0)
    return { label: bucket.label, revenue: money(revenue) }
  })
}
