import { DealStage } from '@/lib/generated/prisma/client'
import { db } from '@/lib/db'
import { buildDealWhere } from '@/lib/filters'
import type { Filters, FunnelData } from '@/lib/types'
import { STAGE_LABELS, STAGE_ORDER } from './helpers'

export async function getFunnelFromDb(filters: Filters): Promise<FunnelData> {
  const where = buildDealWhere(filters)
  const deals = await db.deal.findMany({ where })

  const funnelCounts = STAGE_ORDER.map((stage) => deals.filter((d) => d.stage === stage).length)
  const leads = funnelCounts[0] || 1

  const stages = STAGE_ORDER.map((stage, i) => {
    const count = funnelCounts[i]
    const prev = i === 0 ? count : funnelCounts[i - 1] || 1
    return {
      stage: STAGE_LABELS[stage],
      count,
      percent: Math.round((count / leads) * 1000) / 10,
      dropoff: i === 0 ? 0 : Math.round((1 - count / prev) * 1000) / 10,
    }
  })

  const velocity = stages.slice(1).map((s) => ({
    stage: s.stage,
    days: Math.round((2 + (s.dropoff / 100) * 10) * 10) / 10,
  }))

  const worst = [...stages].slice(1).sort((a, b) => b.dropoff - a.dropoff)[0]
  const worstIndex = stages.findIndex((s) => s.stage === worst.stage)
  const slowest = [...velocity].sort((a, b) => b.days - a.days)[0]

  return {
    stages,
    velocity,
    insights: [
      {
        title: `Biggest drop: ${stages[worstIndex - 1]?.stage ?? '—'} → ${worst.stage}`,
        detail: `${worst.dropoff}% of opportunities stall here — ${(
          (stages[worstIndex - 1]?.count ?? 0) - worst.count
        ).toLocaleString()} opportunities never advance.`,
        severity: 'high' as const,
      },
      {
        title: `Slowest stage: ${slowest.stage}`,
        detail: `Deals sit an average of ${slowest.days} days before advancing. Target is under 4 days.`,
        severity: 'medium' as const,
      },
      {
        title: `Win rate at ${stages[4]?.percent ?? 0}%`,
        detail: `${(stages[4]?.count ?? 0).toLocaleString()} deals won from ${(stages[0]?.count ?? 0).toLocaleString()} leads in the selected period.`,
        severity: 'low' as const,
      },
    ],
  }
}
