'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { useMemo } from 'react'
import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDelta, formatNumber } from '@/lib/format'
import type { RevenueData } from '@/lib/types'
import { cn } from '@/lib/utils'

type Row = RevenueData['breakdown'][number]

export function RevenueBreakdownTable({ rows }: { rows: Row[] }) {
  const columns = useMemo<ColumnDef<Row, unknown>[]>(
    () => [
      { accessorKey: 'month', header: 'Month', cell: ({ row }) => <span className="font-medium">{row.original.month}</span> },
      {
        accessorKey: 'revenue',
        header: 'Revenue',
        meta: { align: 'right' },
        cell: ({ row }) => <span className="font-mono text-sm tabular-nums">{formatCurrency(row.original.revenue)}</span>,
      },
      {
        accessorKey: 'growth',
        header: 'Growth',
        meta: { align: 'right' },
        cell: ({ row }) => {
          const positive = row.original.growth >= 0
          const Icon = positive ? TrendingUpIcon : TrendingDownIcon
          return (
            <span
              className={cn(
                'inline-flex items-center justify-end gap-1 font-mono text-sm tabular-nums',
                positive ? 'text-success' : 'text-destructive',
              )}
            >
              <Icon className="size-3.5" />
              {formatDelta(row.original.growth)}
            </span>
          )
        },
      },
      {
        accessorKey: 'deals',
        header: 'Deals',
        meta: { align: 'right' },
        cell: ({ row }) => <span className="font-mono text-sm tabular-nums">{formatNumber(row.original.deals)}</span>,
      },
      {
        accessorKey: 'avgDeal',
        header: 'Avg deal',
        meta: { align: 'right' },
        cell: ({ row }) => <span className="font-mono text-sm tabular-nums">{formatCurrency(row.original.avgDeal)}</span>,
      },
    ],
    [],
  )

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Revenue breakdown</CardTitle>
        <CardDescription>Month over month revenue, growth and deal volume.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={rows} pageSize={6} emptyMessage="No revenue recorded for this slice." />
      </CardContent>
    </Card>
  )
}
