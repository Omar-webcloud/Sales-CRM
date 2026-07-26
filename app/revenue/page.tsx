'use client'

import { BarChartCard } from '@/components/charts/bar-chart-card'
import { MultiLineChartCard } from '@/components/charts/multi-line-chart-card'
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart'
import { FilterBar } from '@/components/filters/filter-bar'
import { KpiRow, KpiRowSkeleton } from '@/components/kpi-card'
import { PageHeader } from '@/components/layout/page-header'
import { QueryState } from '@/components/query-state'
import { RevenueBreakdownTable } from '@/components/revenue/revenue-breakdown-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useRevenue } from '@/lib/queries'

export default function RevenuePage() {
  const query = useRevenue()

  return (
    <>
      <PageHeader
        title="Revenue analytics"
        description="Track revenue momentum across teams, products and regions with monthly and weekly resolution."
      />
      <FilterBar fields={['team', 'product', 'region']} />

      <QueryState
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <KpiRowSkeleton />
            <Skeleton className="h-[400px]" />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Skeleton className="h-[380px]" />
              <Skeleton className="h-[380px]" />
            </div>
            <Skeleton className="h-[420px]" />
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-6">
            <KpiRow kpis={data.kpis} />

            <RevenueTrendChart
              data={data.trend}
              title="Revenue over time"
              description="Daily or monthly closed-won revenue versus target."
              height="h-[320px]"
              className="min-w-0"
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <BarChartCard
                title="Monthly revenue"
                description="Trailing 12 months of booked revenue."
                data={data.monthly}
                xKey="month"
                yKey="revenue"
                label="Revenue"
                className="min-w-0"
              />
              <MultiLineChartCard
                title="Weekly trend"
                description="Trailing 12 weeks of revenue."
                data={data.weekly}
                xKey="week"
                keys={['revenue']}
                className="min-w-0"
              />
            </div>

            <RevenueBreakdownTable rows={data.breakdown} />
          </div>
        )}
      </QueryState>
    </>
  )
}
