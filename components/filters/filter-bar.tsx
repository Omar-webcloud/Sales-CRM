'use client'

import { RotateCcwIcon, SlidersHorizontalIcon } from 'lucide-react'
import { DateRangePicker } from '@/components/layout/date-range-picker'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCrmStore } from '@/lib/store'
import { DEPARTMENTS, PRODUCTS, REGIONS, SOURCES, TEAMS, type Filters } from '@/lib/types'
import { FilterSelect } from './filter-select'

type FilterKey = 'team' | 'department' | 'region' | 'product' | 'source'

const FIELD_CONFIG: Record<FilterKey, { label: string; options: readonly string[] }> = {
  team: { label: 'Team', options: TEAMS },
  department: { label: 'Department', options: DEPARTMENTS },
  region: { label: 'Region', options: REGIONS },
  product: { label: 'Product', options: PRODUCTS },
  source: { label: 'Source', options: SOURCES },
}

export function FilterBar({ fields }: { fields: FilterKey[] }) {
  const filters = useCrmStore((s) => s.filters)
  const setFilter = useCrmStore((s) => s.setFilter)
  const resetFilters = useCrmStore((s) => s.resetFilters)

  const dirty =
    filters.range !== '30d' ||
    fields.some((field) => !filters[field].startsWith('All'))

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2.5">
      <span className="flex items-center gap-2 pr-1 pl-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <SlidersHorizontalIcon className="size-3.5" />
        Filters
      </span>
      <Separator orientation="vertical" className="h-6" />
      <DateRangePicker />
      {fields.map((field) => (
        <FilterSelect
          key={field}
          label={FIELD_CONFIG[field].label}
          options={FIELD_CONFIG[field].options}
          value={filters[field as keyof Filters] as string}
          onChange={(value) => setFilter(field, value)}
        />
      ))}
      {dirty ? (
        <Button variant="ghost" size="sm" className="ml-auto" onClick={resetFilters}>
          <RotateCcwIcon data-icon="inline-start" />
          Reset
        </Button>
      ) : null}
    </div>
  )
}
