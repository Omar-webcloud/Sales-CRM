import { DealStage } from '@/lib/generated/prisma/client'
import { db } from '@/lib/db'
import { buildDealWhere, getDateRangeStart } from '@/lib/filters'
import type { Filters, RevenueData } from '@/lib/types'
import {
  aggregateByBucket,
  buildKpi,
  dayBuckets,
  money,
  monthBuckets,
  previousPeriodDelta,
  weekBuckets,
} from './helpers'

export async function getRevenueFromDb(filters: Filters): Promise<RevenueData> {
  const where = buildDealWhere(filters)
  const rangeStart = getDateRangeStart(filters.range)

  const [deals, previousDeals] = await Promise.all([
    db.deal.findMany({ where, orderBy: { createdAt: 'asc' } }),
    db.deal.findMany({
      where: {
        ...where,
        createdAt: {
          gte: new Date(rangeStart.getTime() - (Date.now() - rangeStart.getTime())),
          lt: rangeStart,
        },
      },
    }),
  ])

  const wonDeals = deals.filter((d) => d.stage === DealStage.WON)
  const prevWon = previousDeals.filter((d) => d.stage === DealStage.WON)
  const total = wonDeals.reduce((sum, d) => sum + d.amount, 0)
  const prevTotal = prevWon.reduce((sum, d) => sum + d.amount, 0)

  const trendBuckets = dayBuckets(filters)
  const trend = trendBuckets.map((bucket) => {
    const next =
      filters.range === '12m'
        ? new Date(bucket.date.getFullYear(), bucket.date.getMonth() + 1, 1)
        : new Date(bucket.date.getFullYear(), bucket.date.getMonth(), bucket.date.getDate() + 1)
    const bucketDeals = wonDeals.filter((d) => d.createdAt >= bucket.date && d.createdAt < next)
    const revenue = bucketDeals.reduce((sum, d) => sum + d.amount, 0)
    return {
      date: bucket.label,
      revenue: money(revenue),
      target: money(revenue * 1.05 || 1000),
    }
  })

  const monthly = aggregateByBucket(
    wonDeals.map((d) => ({ createdAt: d.createdAt, amount: d.amount })),
    monthBuckets(12),
    true,
  ).map((b) => ({ month: b.label, revenue: b.revenue }))

  const weekly = aggregateByBucket(
    wonDeals.map((d) => ({ createdAt: d.createdAt, amount: d.amount })),
    weekBuckets(12),
    false,
  ).map((b) => ({
    week: b.label,
    revenue: b.revenue,
    deals: wonDeals.filter((d) => b.revenue > 0).length || Math.max(1, Math.round(b.revenue / 21_000)),
  }))

  const breakdown = monthly.map((m, i) => {
    const prev = i === 0 ? m.revenue : monthly[i - 1].revenue
    const monthDeals = wonDeals.filter((d) => {
      const label = monthBuckets(12)[i]?.label
      return label && d.createdAt.getMonth() === monthBuckets(12)[i].date.getMonth()
    })
    const dealCount = Math.max(1, monthDeals.length)
    return {
      month: m.month,
      revenue: m.revenue,
      growth: prev === 0 ? 0 : Math.round(((m.revenue - prev) / prev) * 1000) / 10,
      deals: dealCount,
      avgDeal: money(m.revenue / dealCount),
    }
  })

  const yearTotal = monthly.reduce((s, m) => s + m.revenue, 0)
  const spark = trend.map((t) => t.revenue)

  return {
    kpis: [
      buildKpi('period', 'Revenue in period', money(total), 'currency', previousPeriodDelta(total, prevTotal), spark),
      buildKpi('run-rate', 'Annual run rate', money(yearTotal * 1.08), 'currency', 0, spark),
      buildKpi('best', 'Best month', Math.max(...monthly.map((m) => m.revenue), 0), 'currency', 0, spark),
      buildKpi('avg-month', 'Avg per month', money(yearTotal / 12), 'currency', 0, spark),
    ],
    trend,
    monthly,
    weekly,
    breakdown,
  }
}
