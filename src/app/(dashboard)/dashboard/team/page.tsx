import { teamLeaderboard, activityFeed } from "@/data/mockData";
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

const totalRevenue = teamLeaderboard.reduce((s, r) => s + r.revenue, 0);
const totalDeals = teamLeaderboard.reduce((s, r) => s + r.deals, 0);
const avgConversion =
  teamLeaderboard.reduce((s, r) => s + r.conversion, 0) /
  Math.max(1, teamLeaderboard.length);

export default function TeamPage() {
  return (
    <div className="w-full px-4 md:px-6 py-6">
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Team Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{fmt(totalRevenue)}</div>
            <div className="mt-2">
              <Badge variant="success">+9.3% vs last quarter</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Total Deals</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{totalDeals}</div>
            <div className="mt-2 text-sm text-zinc-500">Across {teamLeaderboard.length} reps</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Avg Conversion</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{(avgConversion * 100).toFixed(1)}%</div>
            <div className="mt-2">
              <Badge variant="secondary">Team average</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Leaderboard */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Team Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Rep</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead className="text-right">Avg Deal</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamLeaderboard.map((rep, i) => {
                  const avgDeal = rep.revenue / Math.max(1, rep.deals);
                  const isTop = i === 0;
                  return (
                    <TableRow key={rep.name}>
                      <TableCell>
                        <span
                          className={
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold " +
                            (isTop
                              ? "bg-amber-100 text-amber-700"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300")
                          }
                        >
                          {i + 1}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{rep.name}</TableCell>
                      <TableCell className="text-right">{fmt(rep.revenue)}</TableCell>
                      <TableCell className="text-right">{rep.deals}</TableCell>
                      <TableCell className="text-right">
                        {(rep.conversion * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">{fmt(avgDeal)}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            rep.conversion >= 0.17
                              ? "success"
                              : rep.conversion >= 0.14
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {rep.conversion >= 0.17
                            ? "Top performer"
                            : rep.conversion >= 0.14
                            ? "On track"
                            : "Needs support"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Rep cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {teamLeaderboard.map((rep) => {
          const share = (rep.revenue / Math.max(1, totalRevenue)) * 100;
          const initials = rep.name
            .split(" ")
            .slice(0, 2)
            .map((p) => p[0])
            .join("");
          return (
            <Card key={rep.name}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                    {initials}
                  </div>
                  <div>
                    <div className="font-medium leading-tight">{rep.name}</div>
                    <div className="text-xs text-zinc-500">{rep.deals} deals</div>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Revenue</span>
                    <span className="font-medium">{fmt(rep.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Conversion</span>
                    <span className="font-medium">{(rep.conversion * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Team share</span>
                    <span className="font-medium">{share.toFixed(1)}%</span>
                  </div>
                </div>
                {/* mini progress bar */}
                <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-50"
                    style={{ width: `${share}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Activity Feed */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {activityFeed.map((item) => {
                const initials = item.actor
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("");
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                      {initials}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.actor}</p>
                      <p className="text-sm text-zinc-500">{item.action}</p>
                      <p className="text-xs text-zinc-400">{item.meta}</p>
                    </div>
                    <div className="text-xs text-zinc-400 shrink-0">{item.at}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
    </div>
  );
}
