import { funnelStages } from "@/data/mockData";
import { FunnelChart } from "@/components/charts/FunnelChart";
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

function fmtInt(n: number) {
  return n.toLocaleString();
}

const topCount = funnelStages[0]?.count ?? 1;
const bottomCount = funnelStages[funnelStages.length - 1]?.count ?? 0;
const overallConversion = ((bottomCount / Math.max(1, topCount)) * 100).toFixed(1);

export default function FunnelPage() {
  return (
    <div className="w-full px-4 md:px-6 py-6">
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Total Leads</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{fmtInt(topCount)}</div>
            <div className="mt-2">
              <Badge variant="secondary">Top of funnel</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Deals Won</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{fmtInt(bottomCount)}</div>
            <div className="mt-2">
              <Badge variant="success">+8.1% vs last month</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-500">Overall Conversion</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">{overallConversion}%</div>
            <div className="mt-2">
              <Badge variant="warning">-1.3% vs last month</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Funnel visual + stage breakdown side-by-side */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Funnel Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart stages={funnelStages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stage Conversion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 pt-2">
              {funnelStages.map((stage, i) => {
                const next = funnelStages[i + 1];
                const rate = next
                  ? ((next.count / Math.max(1, stage.count)) * 100).toFixed(1)
                  : null;
                const barPct = (stage.count / Math.max(1, topCount)) * 100;
                const colors = [
                  "bg-indigo-600",
                  "bg-sky-600",
                  "bg-emerald-600",
                  "bg-zinc-900 dark:bg-zinc-200",
                ];
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {stage.stage}
                      </span>
                      <span className="text-sm font-semibold">{fmtInt(stage.count)}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-2.5 rounded-full ${colors[i] ?? "bg-zinc-500"}`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    {rate && (
                      <div className="mt-1 text-xs text-zinc-400">
                        → {rate}% pass to {next!.stage}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Detailed stage table */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Stage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">% of Top</TableHead>
                  <TableHead className="text-right">Drop-off</TableHead>
                  <TableHead className="text-right">Stage-to-Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funnelStages.map((stage, i) => {
                  const prev = funnelStages[i - 1];
                  const pctOfTop = ((stage.count / Math.max(1, topCount)) * 100).toFixed(1);
                  const dropoff = prev
                    ? (((prev.count - stage.count) / Math.max(1, prev.count)) * 100).toFixed(1)
                    : null;
                  const stageConv = prev
                    ? ((stage.count / Math.max(1, prev.count)) * 100).toFixed(1)
                    : null;
                  return (
                    <TableRow key={stage.stage}>
                      <TableCell className="font-medium">{stage.stage}</TableCell>
                      <TableCell className="text-right">{fmtInt(stage.count)}</TableCell>
                      <TableCell className="text-right">{pctOfTop}%</TableCell>
                      <TableCell className="text-right">
                        {dropoff !== null ? (
                          <Badge variant="warning">-{dropoff}%</Badge>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {stageConv !== null ? (
                          <Badge variant={Number(stageConv) >= 50 ? "success" : "secondary"}>
                            {stageConv}%
                          </Badge>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
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
