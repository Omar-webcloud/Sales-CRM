"use client";

import * as React from "react";
import { FunnelStage } from "@/data/mockData";
import { Card } from "@/components/ui/Card";

function formatInt(n: number) {
  return n.toLocaleString();
}

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {stages.map((s, idx) => {
          const widthPct = (s.count / max) * 100;
          const bg =
            idx === 0
              ? "bg-indigo-600"
              : idx === 1
              ? "bg-sky-600"
              : idx === 2
              ? "bg-emerald-600"
              : "bg-zinc-900 dark:bg-zinc-200";

          return (
            <div key={s.stage} className="flex items-center gap-3">
              <div
                className={
                  "h-3 rounded-full flex-1 " +
                  bg
                }
                style={{ width: `${widthPct}%`, minWidth: 36 }}
                aria-hidden
              />
              <div className="min-w-[84px] text-right">
                <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{s.stage}</div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{formatInt(s.count)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

