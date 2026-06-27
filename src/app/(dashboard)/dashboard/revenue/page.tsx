import { revenueData, teamLeaderboard } from "@/data/mockData";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { BarChart } from "@/components/charts/BarChart";
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

function fmt(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const totalRevenue = revenueData.reduce((s, p) => s + p.revenue, 0);
const prevMonthRevenue = revenueData[revenueData.length - 2]?.revenue ?? 0;
const currentMonthRevenue = revenueData[revenueData.length - 1]?.revenue ?? 0;
const mom = prevMonthRevenue
  ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
  : 0;

export default function RevenuePage() {
  return (
    <div className="w-full px-4 md:px-6 py-6">
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Total Revenue (6 mo)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{fmt(totalRevenue)}</div>
            <div className="mt-2">
              <Badge variant="success">+24% YoY</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Current Month</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{fmt(currentMonthRevenue)}</div>
            <div className="mt-2">
              <Badge variant={mom >= 0 ? "success" : "warning"}>
                {mom >= 0 ? "+" : ""}
                {mom.toFixed(1)}% vs last month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Monthly Average</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">
              {fmt(Math.round(totalRevenue / revenueData.length))}
            </div>
            <div className="mt-2 text-sm text-zinc-500">Over 6 months</div>
          </CardContent>
        </Card>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={[]} />
          </CardContent>
        </Card>
      </section>

      {/* Month-by-month table */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Month-by-Month Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">vs Prev Month</TableHead>
                  <TableHead className="text-right">Cumulative</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueData.map((row, i) => {
                  const prev = revenueData[i - 1]?.revenue;
                  const change = prev ? ((row.revenue - prev) / prev) * 100 : null;
                  const cumulative = revenueData
                    .slice(0, i + 1)
                    .reduce((s, p) => s + p.revenue, 0);
                  return (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right">{fmt(row.revenue)}</TableCell>
                      <TableCell className="text-right">
                        {change !== null ? (
                          <Badge variant={change >= 0 ? "success" : "warning"}>
                            {change >= 0 ? "+" : ""}
                            {change.toFixed(1)}%
                          </Badge>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{fmt(cumulative)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Revenue by rep */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Rep</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rep</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                  <TableHead className="text-right">Avg Deal Size</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamLeaderboard.map((rep) => {
                  const totalRep = teamLeaderboard.reduce((s, r) => s + r.revenue, 0);
                  const share = (rep.revenue / totalRep) * 100;
                  const avgDeal = rep.revenue / Math.max(1, rep.deals);
                  return (
                    <TableRow key={rep.name}>
                      <TableCell className="font-medium">{rep.name}</TableCell>
                      <TableCell className="text-right">{fmt(rep.revenue)}</TableCell>
                      <TableCell className="text-right">{rep.deals}</TableCell>
                      <TableCell className="text-right">{fmt(avgDeal)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{share.toFixed(1)}%</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
    </div>
  );
}
