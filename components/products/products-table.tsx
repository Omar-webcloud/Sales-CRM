'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { SearchIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { formatCurrency, formatDelta, formatNumber, formatPercent } from '@/lib/format'
import type { ProductRow } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ProductsTable({ rows }: { rows: ProductRow[] }) {
  const [search, setSearch] = useState('')

  const columns = useMemo<ColumnDef<ProductRow, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.category}</span>
          </div>
        ),
      },
      {
        accessorKey: 'revenue',
        header: 'Revenue',
        meta: { align: 'right' },
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">{formatCurrency(row.original.revenue)}</span>
        ),
      },
      {
        accessorKey: 'deals',
        header: 'Deals',
        meta: { align: 'right' },
        cell: ({ row }) => <span className="font-mono text-sm tabular-nums">{formatNumber(row.original.deals)}</span>,
      },
      {
        accessorKey: 'arpa',
        header: 'ARPA',
        meta: { align: 'right' },
        cell: ({ row }) => <span className="font-mono text-sm tabular-nums">{formatCurrency(row.original.arpa)}</span>,
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
    ],
    [],
  )

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Product catalog</CardTitle>
        <CardDescription>Revenue contribution and expansion rate per product line.</CardDescription>
        <CardAction>
          <InputGroup className="w-56">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Filter products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Filter products"
            />
          </InputGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <DataTable
            columns={columns}
            data={rows}
            globalFilter={search}
            pageSize={8}
            initialSorting={[{ id: 'revenue', desc: true }]}
            emptyMessage="No products match this search."
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{rows.length} products</Badge>
            <Badge variant="secondary">
              {formatCurrency(
                rows.reduce((total, product) => total + product.revenue, 0),
                true,
              )}{' '}
              total revenue
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
