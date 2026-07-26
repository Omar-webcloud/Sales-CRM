'use client'

import type { UseQueryResult } from '@tanstack/react-query'
import { RefreshCwIcon, SearchXIcon, TriangleAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

type QueryStateProps<T> = {
  query: UseQueryResult<T>
  skeleton?: React.ReactNode
  isEmpty?: (data: T) => boolean
  emptyTitle?: string
  emptyDescription?: string
  children: (data: T) => React.ReactNode
}

export function QueryState<T>({
  query,
  skeleton,
  isEmpty,
  emptyTitle = 'No results',
  emptyDescription = 'Try widening the date range or clearing a filter.',
  children,
}: QueryStateProps<T>) {
  if (query.isPending) {
    return skeleton ?? <Skeleton className="h-64 w-full" />
  }

  if (query.isError) {
    return (
      <Empty className="border border-dashed border-border bg-card/40">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon />
          </EmptyMedia>
          <EmptyTitle>Could not load data</EmptyTitle>
          <EmptyDescription>
            {query.error instanceof Error ? query.error.message : 'Something went wrong while fetching metrics.'}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={() => query.refetch()}>
            <RefreshCwIcon data-icon="inline-start" />
            Retry
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  const data = query.data as T

  if (isEmpty?.(data)) {
    return (
      <Empty className="border border-dashed border-border bg-card/40">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchXIcon />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return <>{children(data)}</>
}
