'use client'

import { Area, AreaChart } from 'recharts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import type { LeaderboardRow } from '@/lib/types'

export function RepCards({ reps }: { reps: LeaderboardRow[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {reps.map((rep) => (
        <Card key={rep.id} className="min-w-0 gap-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback>{rep.initials}</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-0.5">
                <CardTitle className="truncate text-base">{rep.name}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {rep.team} · {rep.department}
                </span>
              </div>
              <Badge variant={rep.quota >= 100 ? 'default' : 'secondary'} className="ml-auto shrink-0">
                {rep.quota}% quota
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <dl className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Revenue</dt>
                <dd className="font-mono text-sm tabular-nums">{formatCurrency(rep.revenue, true)}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Deals</dt>
                <dd className="font-mono text-sm tabular-nums">{formatNumber(rep.deals)}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs text-muted-foreground">Conv.</dt>
                <dd className="font-mono text-sm tabular-nums">{formatPercent(rep.conversion)}</dd>
              </div>
            </dl>

            <Progress value={Math.min(rep.quota, 100)}>
              <ProgressLabel className="text-xs text-muted-foreground">Quota attainment</ProgressLabel>
              <ProgressValue className="text-xs" />
            </Progress>

            <ChartContainer config={{ v: { label: 'Revenue', color: 'var(--chart-1)' } }} className="h-14 w-full">
              <AreaChart data={rep.trend} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`rep-${rep.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="v"
                  type="monotone"
                  stroke="var(--color-v)"
                  strokeWidth={1.5}
                  fill={`url(#rep-${rep.id})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
