import { revenueData, funnelStages, teamLeaderboard } from "@/data/mockData";
import { BarChart } from "@/components/charts/BarChart";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import DashboardShell from "@/components/layout/DashboardShell";

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function Home() {
  return (
    <DashboardShell>
      <div className="w-full px-4 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <div className="text-sm text-zinc-500">Revenue</div>
            <div className="mt-2 text-2xl font-semibold">{formatCurrency(39000)}</div>
            <div className="mt-2">
              <Badge variant="success">+12.4% vs last month</Badge>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-sm text-zinc-500">Deals Won</div>
            <div className="mt-2 text-2xl font-semibold">{100}</div>
            <div className="mt-2">
              <Badge variant="secondary">+8.1%</Badge>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-sm text-zinc-500">Conversion</div>
            <div className="mt-2 text-2xl font-semibold">18.0%</div>
            <div className="mt-2">
              <Badge variant="warning">-1.3%</Badge>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-sm text-zinc-500">Avg Deal</div>
            <div className="mt-2 text-2xl font-semibold">{formatCurrency(18200)}</div>
            <div className="mt-2">
              <Badge variant="default">Steady</Badge>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-500">Revenue</div>
                <div className="mt-1 text-lg font-semibold">Monthly recurring revenue</div>
              </div>
              <Badge variant="secondary">Last 6 months</Badge>
            </div>
            <div className="mt-4">
              <RevenueChart data={revenueData} />
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm text-zinc-500">Funnel</div>
            <div className="mt-1 text-lg font-semibold">Lead → Won</div>
            <div className="mt-4">
              <FunnelChart stages={funnelStages} />
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-500">Team leaderboard</div>
                <div className="mt-1 text-lg font-semibold">Performance overview</div>
              </div>
              <Badge variant="default">Top 4</Badge>
            </div>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Deals</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamLeaderboard.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{row.name}</div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(row.revenue)}</TableCell>
                      <TableCell className="text-right">{row.deals}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.conversion >= 0.17 ? "success" : row.conversion >= 0.14 ? "warning" : "secondary"}>
                          {(row.conversion * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm text-zinc-500">Team revenue trend</div>
            <div className="mt-1 text-lg font-semibold">Quarterly split</div>
            <div className="mt-4">
              <BarChart />
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

