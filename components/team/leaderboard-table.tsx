'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { DataTable } from '@/components/data-table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import { useCrmStore } from '@/lib/store'
import type { LeaderboardRow } from '@/lib/types'
import { cn } from '@/lib/utils'

const RANK_STYLES = ['bg-primary text-primary-foreground', 'bg-secondary text-secondary-foreground', 'bg-accent text-accent-foreground']

export function LeaderboardTable({
  rows,
  title = 'Team leaderboard',
  description = 'Ranked by closed-won revenue in the selected period.',
  pageSize = 8,
}: {
  rows: LeaderboardRow[]
  title?: string
  description?: string
  pageSize?: number
}) {
  const search = useCrmStore((s) => s.search)

  const columns = useMemo<ColumnDef<LeaderboardRow, unknown>[]>(
    () => [
      {
        id: 'rank',
        header: 'Rank',
        enableSorting: false,
        cell: ({ row }) => (
          <span
            className={cn(
              'flex size-6 items-center justify-center rounded-full font-mono text-xs font-semibold',
              row.index < 3 ? RANK_STYLES[row.index] : 'bg-muted text-muted-foreground',
            )}
          >
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Rep',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-7">
              <AvatarFallback className="text-[10px]">{row.original.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{row.original.name}</span>
              <span className="text-xs text-muted-foreground">
                {row.original.team} · {row.original.department}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'deals',
        header: 'Deals',
        meta: { align: 'right' },
        cell: ({ row }) => <span className="font-mono text-sm tabular-nums">{formatNumber(row.original.deals)}</span>,
      },
      {
        accessorKey: 'revenue',
        header: 'Revenue',
        meta: { align: 'right' },
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">{formatCurrency(row.original.revenue, true)}</span>
        ),
      },
      {
        accessorKey: 'conversion',
        header: 'Conversion',
        meta: { align: 'right' },
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">{formatPercent(row.original.conversion)}</span>
        ),
      },
      {
        accessorKey: 'quota',
        header: 'Quota',
        meta: { align: 'right' },
        cell: ({ row }) => (
          <Badge variant={row.original.quota >= 100 ? 'default' : row.original.quota >= 80 ? 'secondary' : 'outline'}>
            {row.original.quota}%
          </Badge>
        ),
      },
    ],
    [],
  )

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Badge variant="outline">{rows.length} reps</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={rows}
          globalFilter={search}
          pageSize={pageSize}
          emptyMessage="No reps match the current filters."
        />
      </CardContent>
    </Card>
  )
}
