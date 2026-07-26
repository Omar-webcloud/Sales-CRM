'use client'

import { CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCrmStore } from '@/lib/store'
import { DATE_RANGES, type DateRange } from '@/lib/types'

const items = Object.fromEntries(DATE_RANGES.map((range) => [range.value, range.label]))

export function DateRangePicker() {
  const range = useCrmStore((s) => s.filters.range)
  const setRange = useCrmStore((s) => s.setRange)

  return (
    <Select
      items={items}
      value={range}
      onValueChange={(next) => setRange(next as DateRange)}
      aria-label="Date range"
    >
      <SelectTrigger size="sm">
        <CalendarIcon className="text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Date range</SelectLabel>
          {DATE_RANGES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
