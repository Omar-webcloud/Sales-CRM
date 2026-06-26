
#  Sales Dashboard CRM — UIUX Wireframe

This document defines the full UI structure for a **Sales Dashboard CRM (analytics-heavy SaaS)** built with a modern frontend stack (Next.js + TypeScript + Tailwind).

---

#  Global Layout

```

┌──────────────────────────────────────────────────────────────┐
│ Navbar top                                                   │
│ Logo | Global Search | Date Range | Notifications | Profile  │
└──────────────────────────────────────────────────────────────┘

┌───────────────┬──────────────────────────────────────────────┐
│ Sidebar       │ Main Content                                 │
│               │                                              │
│ - Overview    │                                              │
│ - Revenue     │                                              │
│ - Team        │                                              │
│ - Funnel      │                                              │
│ - Products    │                                              │
│ - Settings    │                                              │
└───────────────┴──────────────────────────────────────────────┘

```

---

#  1. Overview Dashboard

```

┌──────────────────────────────────────────────────────────────┐
│ KPI CARDS ROW                                                │
│ [Total Revenue] [Deals Won] [Conversion Rate] [Avg Deal $]  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────┐
│ Revenue Trend (Line Chart)   │ Sales Funnel Summary         │
│                              │ Leads → Won                 │
└──────────────────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Team Leaderboard (Table)                                      │
│ Name | Deals | Revenue | Conversion % | Rank                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Recent Activity Feed                                          │
│ - John closed $5,000 deal                                     │
│ - Sarah moved deal to Proposal                                │
│ - Mike added new lead                                         │
└──────────────────────────────────────────────────────────────┘

```

---

#  2. Revenue Analytics Page

```

┌──────────────────────────────────────────────────────────────┐
│ FILTER BAR                                                   │
│ Date Range | Team | Product | Region                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Revenue Over Time (Line Chart)                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────┐
│ Monthly Revenue (Bar Chart)  │ Weekly Trend (Line Chart)    │
└──────────────────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Revenue Breakdown Table                                       │
│ Month | Revenue | Growth % | Deals Count                    │
└──────────────────────────────────────────────────────────────┘

```

---

#  3. Team Performance Page

```

┌──────────────────────────────────────────────────────────────┐
│ FILTER BAR                                                   │
│ Date Range | Team | Department                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TEAM LEADERBOARD                                             │
│ Rank | Name | Revenue | Deals Closed | Conversion %         │
│ 🥇 John                                                      │
│ 🥈 Sarah                                                     │
│ 🥉 Mike                                                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────┐
│ Performance Trend (Line)     │ Deals Closed (Bar Chart)     │
└──────────────────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Individual Performance Cards                                  │
│ [John] [Sarah] [Mike]                                         │
└──────────────────────────────────────────────────────────────┘

```

---

#  4. Sales Funnel Page

```

┌──────────────────────────────────────────────────────────────┐
│ FILTER BAR                                                   │
│ Date Range | Source | Team                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SALES FUNNEL VISUALIZATION                                   │
│                                                              │
│ Leads         ██████████████████ 100%                       │
│ Contacted     ████████████        60%                       │
│ Demo          ████████            40%                       │
│ Proposal      █████               25%                       │
│ Won           ███                 15%                       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ INSIGHTS                                                     │
│ - Biggest drop: Contact → Demo                               │
│ - Weakest stage: Proposal                                   │
└──────────────────────────────────────────────────────────────┘

```

---

#  5. Products Page

```

┌──────────────────────────────────────────────────────────────┐
│ PRODUCTS TABLE                                               │
│ Name | Revenue | Deals | Conversion % | Growth              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────┐
│ Top Products (Bar Chart)     │ Product Trend (Line Chart)   │
└──────────────────────────────┴──────────────────────────────┘

```

---

#  6. Settings Page

```

┌──────────────────────────────────────────────────────────────┐
│ SETTINGS TABS                                               │
│ Profile | Team | Billing | API | Preferences                │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ PROFILE                                                      │
│ Name                                                        │
│ Email                                                       │
│ Role                                                        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TEAM MANAGEMENT                                              │
│ Invite User | Roles | Permissions                            │
└──────────────────────────────────────────────────────────────┘

```

---

#  Core UI Components Checklist

## Layout
- Sidebar
- Top Navbar
- Page Container

## Dashboard
- KPI Cards
- Chart Cards
- Tables
- Activity Feed

## Data Handling
- Filters (date/team/product)
- Search
- Sorting
- Pagination

## Charts
- Line Chart
- Bar Chart
- Funnel Chart
- Leaderboard Table

---

#  Design Principles

- Use consistent spacing (8px system)
- KPI cards always at top
- Charts in middle sections
- Tables at bottom
- Always design:
  - loading states
  - empty states
  - error states



