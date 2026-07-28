import type { CurrencyCode } from './currency'
import { useCrmStore } from './store'

export function formatCurrency(value: number, compact = false) {
  const preferences = useCrmStore.getState().preferences
  const currency = preferences.currency as CurrencyCode
  const rate = preferences.currencyRate ?? 1
  const convertedValue = currency === 'USD' || !rate ? value : value * rate

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(convertedValue)
}

export function formatNumber(value: number, compact = false) {
  return new Intl.NumberFormat('en-US', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value)
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

export function formatDelta(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function formatMetric(value: number, format: 'currency' | 'number' | 'percent') {
  if (format === 'currency') return formatCurrency(value, value >= 100_000)
  if (format === 'percent') return formatPercent(value)
  return formatNumber(value)
}
