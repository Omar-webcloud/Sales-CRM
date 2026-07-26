'use client'

import { ArrowDownIcon } from 'lucide-react'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { FunnelStage } from '@/lib/types'

const STAGE_COLORS = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-4',
  'bg-chart-3',
  'bg-primary',
]

export function FunnelBars({ stages, showDropoff = true }: { stages: FunnelStage[]; showDropoff?: boolean }) {
  return (
    <ul className="flex flex-col gap-4">
      {stages.map((stage, index) => (
        <li key={stage.stage} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">{stage.stage}</span>
            <span className="flex items-baseline gap-2 font-mono text-xs tabular-nums text-muted-foreground">
              {formatNumber(stage.count)}
              <span className="text-foreground">{stage.percent}%</span>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full transition-all duration-500', STAGE_COLORS[index % STAGE_COLORS.length])}
              style={{ width: `${Math.max(stage.percent, 2)}%` }}
            />
          </div>
          {showDropoff && index > 0 ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowDownIcon className="size-3" />
              {stage.dropoff}% drop from {stages[index - 1].stage}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
