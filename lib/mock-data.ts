import { format, subDays, subMonths, subWeeks } from 'date-fns'
import type {
  ActivityItem,
  DateRange,
  Filters,
  FunnelData,
  FunnelStage,
  Kpi,
  LeaderboardRow,
  OverviewData,
  ProductRow,
  ProductsData,
  RevenueData,
  TeamData,
  TrendPoint,
} from './types'

/* ---------- deterministic pseudo random ---------- */

function hashString(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: string) {
  let a = hashString(seed)
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------- static roster ---------- */

const REPS = [
  { id: 'r1', name: 'John Okafor', team: 'Enterprise', department: 'Outbound' },
  { id: 'r2', name: 'Sarah Lindqvist', team: 'Enterprise', department: 'Inbound' },
  { id: 'r3', name: 'Mike Delgado', team: 'Mid-Market', department: 'Outbound' },
  { id: 'r4', name: 'Priya Raman', team: 'Mid-Market', department: 'Partnerships' },
  { id: 'r5', name: 'Tomás Ferreira', team: 'SMB', department: 'Inbound' },
  { id: 'r6', name: 'Hannah Wei', team: 'SMB', department: 'Outbound' },
  { id: 'r7', name: 'Ade Balogun', team: 'Enterprise', department: 'Partnerships' },
  { id: 'r8', name: 'Elena Kovács', team: 'Mid-Market', department: 'Inbound' },
]

const PRODUCT_CATALOG = [
  { id: 'p1', name: 'Atlas CRM', category: 'Platform' },
  { id: 'p2', name: 'Beacon Analytics', category: 'Analytics' },
  { id: 'p3', name: 'Comet Outreach', category: 'Engagement' },
  { id: 'p4', name: 'Delta Forecast', category: 'Analytics' },
  { id: 'p5', name: 'Echo Support', category: 'Service' },
]

const STAGES = ['Leads', 'Contacted', 'Demo', 'Proposal', 'Won']

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

/* ---------- filter helpers ---------- */

export { normalizeFilters } from './filters'

function seedOf(filters: Filters, scope: string) {
  return [scope, filters.range, filters.team, filters.department, filters.region, filters.product, filters.source].join('|')
}

const RANGE_POINTS: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 90, '12m': 12 }

/** Filters narrow the dataset, so totals shrink when a slice is selected. */
function scaleOf(filters: Filters) {
  let s = 1
  if (filters.team !== 'All teams') s *= filters.team === 'Enterprise' ? 0.52 : filters.team === 'Mid-Market' ? 0.31 : 0.17
  if (filters.department !== 'All departments') s *= 0.38
  if (filters.region !== 'All regions') s *= filters.region === 'North America' ? 0.46 : filters.region === 'EMEA' ? 0.29 : 0.14
  if (filters.product !== 'All products') s *= 0.24
  if (filters.source !== 'All sources') s *= 0.27
  return s
}

function money(n: number) {
  return Math.round(n / 100) * 100
}

/* ---------- series builders ---------- */

function buildTrend(filters: Filters, scope = 'trend'): TrendPoint[] {
  const rand = rng(seedOf(filters, scope))
  const scale = scaleOf(filters)
  const points = RANGE_POINTS[filters.range]
  const monthly = filters.range === '12m'
  const base = monthly ? 940_000 : 38_000
  const out: TrendPoint[] = []
  for (let i = points - 1; i >= 0; i--) {
    const date = monthly ? subMonths(new Date(), i) : subDays(new Date(), i)
    const growth = 1 + (points - i) * (monthly ? 0.022 : 0.004)
    const wobble = 0.78 + rand() * 0.44
    const weekendDip = !monthly && [0, 6].includes(date.getDay()) ? 0.55 : 1
    const revenue = money(base * growth * wobble * weekendDip * scale)
    out.push({
      date: monthly ? format(date, 'MMM yyyy') : format(date, 'MMM d'),
      revenue,
      target: money(base * growth * 1.05 * scale),
    })
  }
  return out
}

function buildFunnel(filters: Filters): FunnelStage[] {
  const rand = rng(seedOf(filters, 'funnel'))
  const scale = scaleOf(filters)
  const leads = Math.round(12_400 * scale * (0.9 + rand() * 0.2))
  const ratios = [1, 0.62 + rand() * 0.05, 0.41 + rand() * 0.04, 0.26 + rand() * 0.03, 0.155 + rand() * 0.02]
  return STAGES.map((stage, i) => {
    const count = Math.max(1, Math.round(leads * ratios[i]))
    const prev = i === 0 ? count : Math.max(1, Math.round(leads * ratios[i - 1]))
    return {
      stage,
      count,
      percent: Math.round(ratios[i] * 1000) / 10,
      dropoff: i === 0 ? 0 : Math.round((1 - count / prev) * 1000) / 10,
    }
  })
}

function buildLeaderboard(filters: Filters): LeaderboardRow[] {
  const rand = rng(seedOf(filters, 'leaderboard'))
  const scale = scaleOf(filters)
  return REPS.filter((r) => filters.team === 'All teams' || r.team === filters.team)
    .filter((r) => filters.department === 'All departments' || r.department === filters.department)
    .map((rep) => {
      const revenue = money(420_000 * (0.45 + rand()) * Math.max(scale, 0.35))
      const deals = Math.max(3, Math.round(revenue / (14_000 + rand() * 9_000)))
      return {
        id: rep.id,
        name: rep.name,
        initials: initials(rep.name),
        team: rep.team,
        department: rep.department,
        revenue,
        deals,
        conversion: Math.round((14 + rand() * 18) * 10) / 10,
        quota: Math.round(62 + rand() * 66),
        trend: Array.from({ length: 8 }, (_, i) => ({ i, v: money(revenue / 8 * (0.6 + rand() * 0.8)) })),
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
}

function buildActivity(filters: Filters): ActivityItem[] {
  const rand = rng(seedOf(filters, 'activity'))
  const kinds: ActivityItem['kind'][] = ['won', 'stage', 'lead', 'lost', 'note']
  const companies = ['Northwind', 'Initech', 'Globex', 'Umbrella Foods', 'Soylent Labs', 'Vandelay', 'Stark Retail', 'Acme Freight']
  const stages = ['Contacted', 'Demo', 'Proposal']
  const pool = REPS.filter((r) => filters.team === 'All teams' || r.team === filters.team)
  const roster = pool.length ? pool : REPS
  return Array.from({ length: 12 }, (_, i) => {
    const rep = roster[Math.floor(rand() * roster.length)]
    const kind = kinds[Math.floor(rand() * kinds.length)]
    const company = companies[Math.floor(rand() * companies.length)]
    const at = subDays(new Date(), Math.floor(rand() * 3))
    at.setHours(9 + Math.floor(rand() * 9), Math.floor(rand() * 60), 0, 0)
    return {
      id: `a${i}`,
      actor: rep.name,
      initials: initials(rep.name),
      kind,
      target: company,
      amount: kind === 'won' || kind === 'lost' ? money(6_000 + rand() * 74_000) : undefined,
      action:
        kind === 'won'
          ? 'closed a deal with'
          : kind === 'lost'
            ? 'marked as lost'
            : kind === 'lead'
              ? 'added a new lead'
              : kind === 'note'
                ? 'left a note on'
                : `moved to ${stages[Math.floor(rand() * stages.length)]}`,
      at: at.toISOString(),
    }
  }).sort((a, b) => (a.at < b.at ? 1 : -1))
}

function kpi(id: string, label: string, value: number, fmt: Kpi['format'], delta: number, rand: () => number): Kpi {
  return {
    id,
    label,
    value,
    format: fmt,
    delta,
    spark: Array.from({ length: 12 }, (_, i) => ({ i, v: Math.round(value * (0.55 + rand() * 0.5) * (1 + i * 0.02)) })),
  }
}

/* ---------- page payloads ---------- */

export function getOverview(filters: Filters): OverviewData {
  const rand = rng(seedOf(filters, 'kpi'))
  const trend = buildTrend(filters)
  const funnel = buildFunnel(filters)
  const leaderboard = buildLeaderboard(filters)
  const revenue = trend.reduce((sum, p) => sum + p.revenue, 0)
  const won = funnel[funnel.length - 1].count
  const conversion = Math.round((won / funnel[0].count) * 1000) / 10
  return {
    kpis: [
      kpi('revenue', 'Total revenue', revenue, 'currency', Math.round((rand() * 26 - 5) * 10) / 10, rand),
      kpi('won', 'Deals won', won, 'number', Math.round((rand() * 22 - 4) * 10) / 10, rand),
      kpi('conversion', 'Conversion rate', conversion, 'percent', Math.round((rand() * 9 - 3.5) * 10) / 10, rand),
      kpi('avg', 'Avg deal size', money(revenue / Math.max(won, 1)), 'currency', Math.round((rand() * 14 - 6) * 10) / 10, rand),
    ],
    trend,
    funnel,
    leaderboard,
    activity: buildActivity(filters),
  }
}

export function getRevenue(filters: Filters): RevenueData {
  const rand = rng(seedOf(filters, 'revenue'))
  const scale = scaleOf(filters)
  const trend = buildTrend(filters, 'revenue-trend')
  const total = trend.reduce((s, p) => s + p.revenue, 0)

  const monthly = Array.from({ length: 12 }, (_, idx) => {
    const d = subMonths(new Date(), 11 - idx)
    return {
      month: format(d, 'MMM'),
      revenue: money(760_000 * (1 + idx * 0.035) * (0.82 + rand() * 0.38) * scale),
    }
  })

  const weekly = Array.from({ length: 12 }, (_, idx) => {
    const d = subWeeks(new Date(), 11 - idx)
    const revenue = money(196_000 * (1 + idx * 0.02) * (0.78 + rand() * 0.45) * scale)
    return { week: `W${format(d, 'w')}`, revenue, deals: Math.max(2, Math.round(revenue / 21_000)) }
  })

  const breakdown = monthly.map((m, i) => {
    const prev = i === 0 ? m.revenue : monthly[i - 1].revenue
    const deals = Math.max(3, Math.round(m.revenue / (18_000 + rand() * 8_000)))
    return {
      month: m.month,
      revenue: m.revenue,
      growth: Math.round(((m.revenue - prev) / prev) * 1000) / 10,
      deals,
      avgDeal: money(m.revenue / deals),
    }
  })

  const yearTotal = monthly.reduce((s, m) => s + m.revenue, 0)
  return {
    kpis: [
      kpi('period', 'Revenue in period', total, 'currency', Math.round((rand() * 24 - 4) * 10) / 10, rand),
      kpi('run-rate', 'Annual run rate', money(yearTotal * 1.08), 'currency', Math.round((rand() * 18 - 3) * 10) / 10, rand),
      kpi('best', 'Best month', Math.max(...monthly.map((m) => m.revenue)), 'currency', Math.round((rand() * 12 - 2) * 10) / 10, rand),
      kpi('avg-month', 'Avg per month', money(yearTotal / 12), 'currency', Math.round((rand() * 15 - 5) * 10) / 10, rand),
    ],
    trend,
    monthly,
    weekly,
    breakdown,
  }
}

export function getTeam(filters: Filters): TeamData {
  const rand = rng(seedOf(filters, 'team'))
  const leaderboard = buildLeaderboard(filters)
  const top = leaderboard.slice(0, 3)
  const performance = Array.from({ length: 8 }, (_, idx) => {
    const row: { label: string; [rep: string]: number | string } = {
      label: format(subWeeks(new Date(), 7 - idx), 'MMM d'),
    }
    top.forEach((rep) => {
      row[rep.name] = money((rep.revenue / 8) * (0.62 + rand() * 0.8))
    })
    return row
  })
  return {
    leaderboard,
    performance,
    performanceKeys: top.map((r) => r.name),
    dealsClosed: leaderboard.map((r) => ({ name: r.name.split(' ')[0], deals: r.deals })),
  }
}

export function getFunnel(filters: Filters): FunnelData {
  const stages = buildFunnel(filters)
  const rand = rng(seedOf(filters, 'funnel-page'))
  const worst = [...stages].slice(1).sort((a, b) => b.dropoff - a.dropoff)[0]
  const worstIndex = stages.findIndex((s) => s.stage === worst.stage)
  const velocity = stages.slice(1).map((s) => ({ stage: s.stage, days: Math.round((2 + rand() * 11) * 10) / 10 }))
  const slowest = [...velocity].sort((a, b) => b.days - a.days)[0]
  return {
    stages,
    velocity,
    insights: [
      {
        title: `Biggest drop: ${stages[worstIndex - 1].stage} → ${worst.stage}`,
        detail: `${worst.dropoff}% of opportunities stall here — ${(
          stages[worstIndex - 1].count - worst.count
        ).toLocaleString()} opportunities never advance.`,
        severity: 'high',
      },
      {
        title: `Slowest stage: ${slowest.stage}`,
        detail: `Deals sit an average of ${slowest.days} days before advancing. Target is under 4 days.`,
        severity: 'medium',
      },
      {
        title: `Win rate at ${stages[4].percent}%`,
        detail: `${stages[4].count.toLocaleString()} deals won from ${stages[0].count.toLocaleString()} leads in the selected period.`,
        severity: 'low',
      },
    ],
  }
}

export function getProducts(filters: Filters): ProductsData {
  const rand = rng(seedOf(filters, 'products'))
  const scale = scaleOf(filters)
  const catalog = PRODUCT_CATALOG.filter((p) => filters.product === 'All products' || p.name === filters.product)
  const products: ProductRow[] = catalog.map((p) => {
    const revenue = money(1_640_000 * (0.28 + rand()) * Math.max(scale, 0.3))
    const deals = Math.max(6, Math.round(revenue / (22_000 + rand() * 15_000)))
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      revenue,
      deals,
      conversion: Math.round((11 + rand() * 21) * 10) / 10,
      growth: Math.round((rand() * 46 - 14) * 10) / 10,
      arpa: money(revenue / deals),
    }
  })
  const sorted = [...products].sort((a, b) => b.revenue - a.revenue)
  const trendKeys = sorted.slice(0, 4).map((p) => p.name)
  const trend = Array.from({ length: 12 }, (_, idx) => {
    const row: { label: string; [product: string]: number | string } = {
      label: format(subMonths(new Date(), 11 - idx), 'MMM'),
    }
    trendKeys.forEach((name) => {
      const p = sorted.find((s) => s.name === name)!
      row[name] = money((p.revenue / 12) * (0.6 + rand() * 0.85) * (1 + idx * 0.02))
    })
    return row
  })
  return {
    products: sorted,
    top: sorted.map((p) => ({ name: p.name, revenue: p.revenue })),
    trend,
    trendKeys,
  }
}
