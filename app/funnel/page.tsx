'use client'

import { LightbulbIcon } from 'lucide-react'
import { BarChartCard } from '@/components/charts/bar-chart-card'
import { FilterBar } from '@/components/filters/filter-bar'
import { FunnelBars } from '@/components/funnel/funnel-bars'
import { PageHeader } from '@/components/layout/page-header'
import { QueryState } from '@/components/query-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFunnel } from '@/lib/queries'
import { formatNumber } from '@/lib/format'

const SEVERITY_VARIANT = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
} as const

export default function FunnelPage() {
  const query = useFunnel()

  return (
    <>
      <PageHeader
        title="Sales funnel"
        description="Track stage-by-stage conversion, spot the biggest leaks and measure how long deals sit at each step."
      />
      <FilterBar fields={['source', 'region']} />

      <QueryState
        query={query}
        isEmpty={(data) => data.stages.length === 0}
        emptyTitle="No funnel data"
        emptyDescription="No opportunities matched this source and region combination."
        skeleton={
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <Skeleton className="h-[420px] xl:col-span-2" />
              <Skeleton className="h-[420px]" />
            </div>
            <Skeleton className="h-[360px]" />
          </div>
        }
      >
        {(data) => {
          const top = data.stages[0]
          const bottom = data.stages[data.stages.length - 1]
          return (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="min-w-0 xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Stage conversion</CardTitle>
                    <CardDescription>
                      {formatNumber(top.count)} opportunities entered, {formatNumber(bottom.count)} closed won —{' '}
                      {bottom.percent}% end-to-end conversion.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FunnelBars stages={data.stages} />
                  </CardContent>
                </Card>

                <Card className="min-w-0">
                  <CardHeader>
                    <CardTitle>Insights</CardTitle>
                    <CardDescription>Automatically detected bottlenecks in this slice.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-4">
                      {data.insights.map((insight) => (
                        <li key={insight.title} className="flex gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <LightbulbIcon className="size-4" />
                          </span>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{insight.title}</p>
                              <Badge variant={SEVERITY_VARIANT[insight.severity]} className="capitalize">
                                {insight.severity}
                              </Badge>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">{insight.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <BarChartCard
                title="Stage velocity"
                description="Average number of days an opportunity spends in each stage."
                data={data.velocity}
                xKey="stage"
                yKey="days"
                label="Days"
                valueFormat="number"
                color="var(--chart-4)"
              />
            </div>
          )
        }}
      </QueryState>
    </>
  )
}
