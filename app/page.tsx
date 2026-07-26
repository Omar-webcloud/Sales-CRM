'use client'

import { DownloadIcon, RefreshCwIcon } from 'lucide-react'
import { toast } from 'sonner'
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart'
import { FunnelBars } from '@/components/funnel/funnel-bars'
import { KpiRow, KpiRowSkeleton } from '@/components/kpi-card'
import { PageHeader } from '@/components/layout/page-header'
import { ActivityFeed } from '@/components/overview/activity-feed'
import { QueryState } from '@/components/query-state'
import { LeaderboardTable } from '@/components/team/leaderboard-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useOverview } from '@/lib/queries'
import { formatPercent } from '@/lib/format'

export default function OverviewPage() {
  const query = useOverview()

  return (
    <>
      <PageHeader
        title="Overview"
        description="A single view of revenue, pipeline health and rep performance for the selected period."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                query.refetch()
                toast.success('Dashboard refreshed')
              }}
            >
              <RefreshCwIcon data-icon="inline-start" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => toast.success('Export queued — you will get an email shortly')}>
              <DownloadIcon data-icon="inline-start" />
              Export
            </Button>
          </>
        }
      />

      <QueryState
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <KpiRowSkeleton />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Skeleton className="h-[420px] lg:col-span-2" />
              <Skeleton className="h-[420px]" />
            </div>
            <Skeleton className="h-[380px]" />
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-6">
            <KpiRow kpis={data.kpis} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <RevenueTrendChart data={data.trend} className="min-w-0 lg:col-span-2" />

              <Card className="min-w-0">
                <CardHeader>
                  <CardTitle>Sales funnel</CardTitle>
                  <CardDescription>
                    Leads → Won, {formatPercent(data.funnel[data.funnel.length - 1].percent)} end-to-end conversion.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FunnelBars stages={data.funnel} showDropoff={false} />
                </CardContent>
              </Card>
            </div>

            <LeaderboardTable rows={data.leaderboard} pageSize={5} />

            <ActivityFeed items={data.activity} />
          </div>
        )}
      </QueryState>
    </>
  )
}
