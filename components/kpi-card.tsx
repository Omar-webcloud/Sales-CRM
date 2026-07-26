'use client'

import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDelta, formatMetric } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Kpi } from '@/lib/types'

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const positive = kpi.delta >= 0
  const TrendIcon = positive ? TrendingUpIcon : TrendingDownIcon

  return (
    <Card className="gap-3 overflow-hidden">
      <CardHeader className="gap-1">
        <CardDescription className="text-xs font-medium tracking-wide uppercase">{kpi.label}</CardDescription>
        <CardTitle className="font-mono text-2xl tabular-nums">{formatMetric(kpi.value, kpi.format)}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <span
          className={cn(
            'flex items-center gap-1 text-xs font-medium tabular-nums',
            positive ? 'text-success' : 'text-destructive',
          )}
        >
          <TrendIcon className="size-3.5" />
          {formatDelta(kpi.delta)}
          <span className="text-muted-foreground">vs prev.</span>
        </span>
        <ChartContainer
          config={{ v: { label: kpi.label, color: positive ? 'var(--success)' : 'var(--destructive)' } }}
          className="h-10 w-24"
        >
          <AreaChart data={kpi.spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="v"
              type="monotone"
              stroke="var(--color-v)"
              strokeWidth={1.5}
              fill={`url(#spark-${kpi.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  )
}

export function KpiRowSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} className="gap-3">
          <CardHeader className="gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
