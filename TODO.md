# TODO - Sales-CRM dashboard (layered build)

- [ ] Phase 1: Foundation
  - [ ] Add dashboard route group + shared layout shell (Sidebar + Navbar + PageContainer)

- [ ] Phase 2: Design system verification
  - [ ] Ensure existing ui/components compile (Button/Card/Table/Badge/Select)
  - [ ] Ensure existing charts compile (RevenueChart/FunnelChart/BarChart)

- [ ] Phase 3: Layout shell
  - [ ] Create `app/(dashboard)/layout.tsx` to wrap dashboard pages

- [ ] Phase 4: Mock data
  - [ ] Create `src/data/mockData.ts` with revenue/team/funnel/activity mock datasets

- [ ] Phase 5: Overview dashboard
  - [ ] Create `app/(dashboard)/dashboard/page.tsx` implementing KPI row, revenue chart, funnel summary, team table, activity feed

- [ ] Validate
  - [ ] Run `npm run lint` and `npm run build`

