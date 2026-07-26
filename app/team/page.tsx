'use client'

import { BarChartCard } from '@/components/charts/bar-chart-card'
import { MultiLineChartCard } from '@/components/charts/multi-line-chart-card'
import { FilterBar } from '@/components/filters/filter-bar'
import { PageHeader } from '@/components/layout/page-header'
import { QueryState } from '@/components/query-state'
import { LeaderboardTable } from '@/components/team/leaderboard-table'
import { RepCards } from '@/components/team/rep-cards'
import { Skeleton } from '@/components/ui/skeleton'
import { useTeam } from '@/lib/queries'

export default function TeamPage() {
  const query = useTeam()

  return (
    <>
      <PageHeader
        title="Team performance"
        description="Compare rep output, quota attainment and closing velocity across teams and departments."
      />
      <FilterBar fields={['team', 'department']} />

      <QueryState
        query={query}
        isEmpty={(data) => data.leaderboard.length === 0}
        emptyTitle="No reps in this slice"
        emptyDescription="This team and department combination has no assigned reps. Try resetting the filters."
        skeleton={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[420px]" />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Skeleton className="h-[380px]" />
              <Skeleton className="h-[380px]" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-[260px]" />
              <Skeleton className="h-[260px]" />
              <Skeleton className="h-[260px]" />
            </div>
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-6">
            <LeaderboardTable
              rows={data.leaderboard}
              title="Leaderboard"
              description="Ranked by revenue. Sort any column to change the view."
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <MultiLineChartCard
                title="Performance trend"
                description="Weekly revenue for the top three reps."
                data={data.performance}
                xKey="label"
                keys={data.performanceKeys}
                className="min-w-0"
              />
              <BarChartCard
                title="Deals closed"
                description="Closed-won deal count per rep."
                data={data.dealsClosed}
                xKey="name"
                yKey="deals"
                label="Deals"
                valueFormat="number"
                color="var(--chart-2)"
                className="min-w-0"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold tracking-tight">Individual performance</h2>
              <RepCards reps={data.leaderboard.slice(0, 6)} />
            </div>
          </div>
        )}
      </QueryState>
    </>
  )
}
