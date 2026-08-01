import { DealStage } from '@/lib/generated/prisma/client'
import { db } from '@/lib/db'
import { buildActivityWhere, buildDealWhere, getDateRangeStart } from '@/lib/filters'
import type { Filters, OverviewData } from '@/lib/types'
import {
  STAGE_LABELS,
  STAGE_ORDER,
  buildKpi,
  dayBuckets,
  initials,
  money,
  previousPeriodDelta,
} from './helpers'

export async function getOverviewFromDb(filters: Filters): Promise<OverviewData> {
  const where = buildDealWhere(filters)
  const activityWhere = buildActivityWhere(filters)

  const [deals, activities, previousDeals] = await Promise.all([
    db.deal.findMany({
      where,
      include: { rep: true, product: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.activity.findMany({
      where: activityWhere,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    db.deal.findMany({
      where: {
        ...where,
        createdAt: {
          gte: new Date(
            getDateRangeStart(filters.range).getTime() -
              (Date.now() - getDateRangeStart(filters.range).getTime()),
          ),
          lt: getDateRangeStart(filters.range),
        },
      },
    }),
  ])

  const wonDeals = deals.filter((d) => d.stage === DealStage.WON)
  const totalRevenue = wonDeals.reduce((sum, d) => sum + d.amount, 0)
  const prevWon = previousDeals.filter((d) => d.stage === DealStage.WON)
  const prevRevenue = prevWon.reduce((sum, d) => sum + d.amount, 0)

  const leadsCount = deals.filter((d) => d.stage === DealStage.LEADS).length || deals.length
  const wonCount = wonDeals.length
  const conversion = leadsCount > 0 ? Math.round((wonCount / leadsCount) * 1000) / 10 : 0

  const buckets = dayBuckets(filters)
  const trend = buckets.map((bucket) => {
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

  const funnelCounts = STAGE_ORDER.map((stage) => deals.filter((d) => d.stage === stage).length)
  const leads = funnelCounts[0] || 1
  const funnel = STAGE_ORDER.map((stage, i) => {
    const count = funnelCounts[i]
    const prev = i === 0 ? count : funnelCounts[i - 1] || 1
    return {
      stage: STAGE_LABELS[stage],
      count,
      percent: Math.round((count / leads) * 1000) / 10,
      dropoff: i === 0 ? 0 : Math.round((1 - count / prev) * 1000) / 10,
    }
  })

  const repMap = new Map<
    string,
    { rep: (typeof deals)[0]['rep']; revenue: number; deals: number; won: number }
  >()
  for (const deal of deals) {
    const entry = repMap.get(deal.repId) ?? { rep: deal.rep, revenue: 0, deals: 0, won: 0 }
    entry.deals += 1
    if (deal.stage === DealStage.WON) {
      entry.revenue += deal.amount
      entry.won += 1
    }
    repMap.set(deal.repId, entry)
  }

  const leaderboard = [...repMap.values()]
    .map(({ rep, revenue, deals: dealCount, won }) => ({
      id: rep.id,
      name: rep.name,
      initials: initials(rep.name),
      team: rep.team,
      department: rep.department,
      revenue: money(revenue),
      deals: dealCount,
      conversion: dealCount > 0 ? Math.round((won / dealCount) * 1000) / 10 : 0,
      quota: Math.min(100, Math.round((revenue / 500_000) * 100)),
      trend: Array.from({ length: 8 }, (_, i) => ({
        i,
        v: money(revenue / 8 + i * 1000),
      })),
    }))
    .sort((a, b) => b.revenue - a.revenue)

  const spark = trend.map((t) => t.revenue)

  return {
    kpis: [
      buildKpi(
        'revenue',
        'Total revenue',
        money(totalRevenue),
        'currency',
        previousPeriodDelta(totalRevenue, prevRevenue),
        spark,
      ),
      buildKpi(
        'won',
        'Deals won',
        wonCount,
        'number',
        previousPeriodDelta(wonCount, prevWon.length),
        spark,
      ),
      buildKpi('conversion', 'Conversion rate', conversion, 'percent', 0, spark),
      buildKpi(
        'avg',
        'Avg deal size',
        money(wonCount > 0 ? totalRevenue / wonCount : 0),
        'currency',
        0,
        spark,
      ),
    ],
    trend,
    funnel,
    leaderboard,
    activity: activities.map((a) => ({
      id: a.id,
      actor: a.user.name,
      initials: initials(a.user.name),
      action: a.action,
      target: a.target,
      amount: a.amount ?? undefined,
      kind: a.kind.toLowerCase() as 'won' | 'stage' | 'lead' | 'lost' | 'note',
      at: a.createdAt.toISOString(),
    })),
  }
}
