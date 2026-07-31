import { format, subWeeks } from 'date-fns'
import { DealStage } from '@/lib/generated/prisma'
import { db } from '@/lib/db'
import { buildDealWhere } from '@/lib/filters'
import type { Filters, TeamData } from '@/lib/types'
import { initials, money } from './helpers'

export async function getTeamFromDb(filters: Filters): Promise<TeamData> {
  const where = buildDealWhere(filters)
  const deals = await db.deal.findMany({
    where,
    include: { rep: true },
    orderBy: { createdAt: 'desc' },
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
      trend: Array.from({ length: 8 }, (_, i) => ({ i, v: money(revenue / 8 + i * 1000) })),
    }))
    .sort((a, b) => b.revenue - a.revenue)

  const top = leaderboard.slice(0, 3)
  const performance = Array.from({ length: 8 }, (_, idx) => {
    const weekStart = subWeeks(new Date(), 7 - idx)
    const weekEnd = subWeeks(new Date(), 6 - idx)
    const row: { label: string; [rep: string]: number | string } = {
      label: format(weekStart, 'MMM d'),
    }
    top.forEach((rep) => {
      const repDeals = deals.filter(
        (d) =>
          d.repId === rep.id &&
          d.stage === DealStage.WON &&
          d.createdAt >= weekStart &&
          d.createdAt < weekEnd,
      )
      row[rep.name] = money(repDeals.reduce((s, d) => s + d.amount, 0))
    })
    return row
  })

  return {
    leaderboard,
    performance,
    performanceKeys: top.map((r) => r.name),
    dealsClosed: leaderboard.map((r) => ({ name: r.name.split(' ')[0], deals: r.deals })),
  }
}
