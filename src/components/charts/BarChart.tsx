"use client";

import * as React from "react";
import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueData } from "@/data/mockData";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function BarChart() {
  // Simple quarterly-ish split derived from existing mock revenue.
  const chartData = [
    { label: "Q1", value: revenueData.slice(0, 2).reduce((a, b) => a + b.revenue, 0) },
    { label: "Q2", value: revenueData.slice(2, 4).reduce((a, b) => a + b.revenue, 0) },
    { label: "Q3", value: revenueData.slice(4, 5).reduce((a, b) => a + b.revenue, 0) },
    { label: "Q4", value: revenueData.slice(5, 6).reduce((a, b) => a + b.revenue, 0) },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatMoney} />
          <Tooltip formatter={(v: unknown) => formatMoney(Number(v))} contentStyle={{ background: "#111827", border: "none" }} />
          <Bar dataKey="value" fill="#18181b" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

