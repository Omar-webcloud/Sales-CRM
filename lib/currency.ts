export const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'AED', 'BDT', 'SAR', 'SGD'] as const

export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number]

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  USD: 'USD (US Dollar)',
  EUR: 'EUR (Euro)',
  GBP: 'GBP (British Pound)',
  AED: 'AED (UAE Dirham)',
  BDT: 'BDT (Bangladeshi Taka)',
  SAR: 'SAR (Saudi Riyal)',
  SGD: 'SGD (Singapore Dollar)',
}

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  BDT: 121.5,
  SAR: 3.75,
  SGD: 1.35,
}

export async function fetchExchangeRate(from: CurrencyCode = 'USD', to: CurrencyCode) {
  if (from === to) return 1

  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Unable to fetch exchange rate for ${from} to ${to}`)
    }

    const data = await response.json()
    const rate = data?.rates?.[to]

    if (typeof rate === 'number') {
      return rate
    }
  } catch {
    // Fall back to built-in reference rates when the API is blocked or unavailable.
  }

  return FALLBACK_RATES[to] ?? 1
}

export function convertCurrency(value: number, rate: number | undefined, currency: CurrencyCode) {
  if (currency === 'USD' || !rate) return value
  return value * rate
}
