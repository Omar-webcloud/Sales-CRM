'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type FilterSelectProps = {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  icon?: React.ReactNode
  className?: string
}

export function FilterSelect({ label, value, options, onChange, icon, className }: FilterSelectProps) {
  const items = Object.fromEntries(options.map((option) => [option, option]))

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => onChange(String(next))}
      aria-label={label}
    >
      <SelectTrigger size="sm" className={className}>
        {icon}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
