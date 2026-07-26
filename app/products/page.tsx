'use client'

import { BarChartCard } from '@/components/charts/bar-chart-card'
import { MultiLineChartCard } from '@/components/charts/multi-line-chart-card'
import { FilterBar } from '@/components/filters/filter-bar'
import { PageHeader } from '@/components/layout/page-header'
import { ProductsTable } from '@/components/products/products-table'
import { QueryState } from '@/components/query-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useProducts } from '@/lib/queries'

export default function ProductsPage() {
  const query = useProducts()

  return (
    <>
      <PageHeader
        title="Products"
        description="Revenue by product line, expansion trends and which lines convert best in the current slice."
      />
      <FilterBar fields={['product', 'region']} />

      <QueryState
        query={query}
        isEmpty={(data) => data.products.length === 0}
        emptyTitle="No products"
        emptyDescription="No product lines matched this product and region combination."
        skeleton={
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Skeleton className="h-[380px]" />
              <Skeleton className="h-[380px]" />
            </div>
            <Skeleton className="h-[480px]" />
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <BarChartCard
                title="Revenue by product"
                description="Total closed-won revenue per product line."
                data={data.top}
                xKey="name"
                yKey="revenue"
                label="Revenue"
                layout="vertical"
                className="min-w-0"
              />
              <MultiLineChartCard
                title="Product trend"
                description="Monthly revenue trajectory for the leading product lines."
                data={data.trend}
                xKey="label"
                keys={data.trendKeys}
                className="min-w-0"
              />
            </div>

            <ProductsTable rows={data.products} />
          </div>
        )}
      </QueryState>
    </>
  )
}
