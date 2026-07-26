export type DateRange = '7d' | '30d' | '90d' | '12m'

export const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '12m', label: 'Last 12 months' },
]

export const TEAMS = ['All teams', 'Enterprise', 'Mid-Market', 'SMB'] as const
export const DEPARTMENTS = ['All departments', 'Inbound', 'Outbound', 'Partnerships'] as const
export const REGIONS = ['All regions', 'North America', 'EMEA', 'APAC', 'LATAM'] as const
export const PRODUCTS = [
  'All products',
  'Atlas CRM',
  'Beacon Analytics',
  'Comet Outreach',
  'Delta Forecast',
  'Echo Support',
] as const
export const SOURCES = ['All sources', 'Website', 'Outbound', 'Referral', 'Events', 'Partners'] as const

export type Filters = {
  range: DateRange
  team: string
  department: string
  region: string
  product: string
  source: string
}

export type Kpi = {
  id: string
  label: string
  value: number
  format: 'currency' | 'number' | 'percent'
  delta: number
  spark: { i: number; v: number }[]
}

export type TrendPoint = {
  date: string
  revenue: number
  target: number
}

export type FunnelStage = {
  stage: string
  count: number
  percent: number
  dropoff: number
}

export type LeaderboardRow = {
  id: string
  name: string
  initials: string
  team: string
  department: string
  revenue: number
  deals: number
  conversion: number
  quota: number
  trend: { i: number; v: number }[]
}

export type ActivityItem = {
  id: string
  actor: string
  initials: string
  action: string
  target: string
  amount?: number
  kind: 'won' | 'stage' | 'lead' | 'lost' | 'note'
  at: string
}

export type OverviewData = {
  kpis: Kpi[]
  trend: TrendPoint[]
  funnel: FunnelStage[]
  leaderboard: LeaderboardRow[]
  activity: ActivityItem[]
}

export type RevenueData = {
  kpis: Kpi[]
  trend: TrendPoint[]
  monthly: { month: string; revenue: number }[]
  weekly: { week: string; revenue: number; deals: number }[]
  breakdown: { month: string; revenue: number; growth: number; deals: number; avgDeal: number }[]
}

export type TeamData = {
  leaderboard: LeaderboardRow[]
  performance: { label: string; [rep: string]: number | string }[]
  performanceKeys: string[]
  dealsClosed: { name: string; deals: number }[]
}

export type FunnelData = {
  stages: FunnelStage[]
  insights: { title: string; detail: string; severity: 'high' | 'medium' | 'low' }[]
  velocity: { stage: string; days: number }[]
}

export type ProductRow = {
  id: string
  name: string
  category: string
  revenue: number
  deals: number
  conversion: number
  growth: number
  arpa: number
}

export type ProductsData = {
  products: ProductRow[]
  top: { name: string; revenue: number }[]
  trend: { label: string; [product: string]: number | string }[]
  trendKeys: string[]
}
