export type RevenuePoint = { month: string; revenue: number };
export type TeamRow = {
  name: string;
  revenue: number;
  deals: number;
  conversion: number; // 0-1
};
export type FunnelStage = { stage: string; count: number };
export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  meta: string;
  at: string;
};

export const revenueData: RevenuePoint[] = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 22000 },
  { month: "Mar", revenue: 26000 },
  { month: "Apr", revenue: 24000 },
  { month: "May", revenue: 31000 },
  { month: "Jun", revenue: 39000 },
];

export const funnelStages: FunnelStage[] = [
  { stage: "Leads", count: 1000 },
  { stage: "Contacted", count: 600 },
  { stage: "Demo", count: 250 },
  { stage: "Won", count: 100 },
];

export const teamLeaderboard: TeamRow[] = [
  { name: "Ava Johnson", revenue: 48000, deals: 38, conversion: 0.18 },
  { name: "Noah Smith", revenue: 41000, deals: 33, conversion: 0.16 },
  { name: "Mia Chen", revenue: 36000, deals: 29, conversion: 0.14 },
  { name: "Ethan Brown", revenue: 32000, deals: 25, conversion: 0.12 },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "1",
    actor: "Ava Johnson",
    action: "closed a deal",
    meta: "Acme Corp • $18,200",
    at: "2h ago",
  },
  {
    id: "2",
    actor: "Noah Smith",
    action: "scheduled a demo",
    meta: "Globex • 30 min",
    at: "5h ago",
  },
  {
    id: "3",
    actor: "Mia Chen",
    action: "sent proposal",
    meta: "Initech • $9,500",
    at: "Yesterday",
  },
  {
    id: "4",
    actor: "Ethan Brown",
    action: "won an opportunity",
    meta: "Umbrella Co. • $12,800",
    at: "2 days ago",
  },
];

