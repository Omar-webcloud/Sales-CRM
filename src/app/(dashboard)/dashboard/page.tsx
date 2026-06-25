import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import RevenueChart from "@/components/charts/RevenueChart";
import FunnelChart from "@/components/charts/FunnelChart";
import BarChart from "@/components/charts/BarChart";

import {
  activityFeed,
  funnelStages,
  revenueData,
  teamLeaderboard,
} from "@/data/mockData";

export default function DashboardPage() {
  const totalRevenue = revenueData.reduce(
    (sum, p) => sum + p.revenue,
    0
  );

  const dealsWon = teamLeaderboard.reduce(
    (sum, r) => sum + r.deals * r.conversion,
    0
  );

  const conversion =
    teamLeaderboard.reduce((sum, r) => sum + r.conversion, 0) /
    Math.max(1, teamLeaderboard.length);

  const avgDeal =
    totalRevenue /
    Math.max(
      1,
      teamLeaderboard.reduce((s, r) => s + r.deals, 0)
    );

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">
              Revenue
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">
              ${totalRevenue.toLocaleString()}
            </div>

            <div className="mt-2">
              <Badge variant="success">+12.4%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">
              Deals Won
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">
              {Math.round(dealsWon)}
            </div>

            <div className="mt-2 text-sm text-zinc-500">
              Last 6 months
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">
              Conversion
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">
              {(conversion * 100).toFixed(1)}%
            </div>

            <div className="mt-2">
              <Badge variant="secondary">Stable</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">
              Avg Deal
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">
              ${avgDeal.toFixed(0)}
            </div>

            <div className="mt-2 text-sm text-zinc-500">
              Weighted
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>

          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funnel Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <FunnelChart stages={funnelStages} />
          </CardContent>
        </Card>
      </section>

      {/* Team + Bar Chart */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Team Leaderboard</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">
                    Revenue
                  </TableHead>
                  <TableHead className="text-right">
                    Deals
                  </TableHead>
                  <TableHead className="text-right">
                    Conversion
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {teamLeaderboard.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="font-medium">
                      {r.name}
                    </TableCell>

                    <TableCell className="text-right">
                      ${r.revenue.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right">
                      {r.deals}
                    </TableCell>

                    <TableCell className="text-right">
                      {(r.conversion * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline by Month</CardTitle>
          </CardHeader>

          <CardContent>
            <BarChart data={revenueData} />
          </CardContent>
        </Card>
      </section>

      {/* Activity Feed */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                    {item.actor
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {item.actor}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {item.action}
                    </p>

                    {"time" in item && (
                      <p className="mt-1 text-xs text-zinc-400">
                        {item.time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}