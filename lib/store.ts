'use client'

import { create } from 'zustand'
import type { DateRange, Filters } from './types'

type Notification = {
  id: string
  title: string
  body: string
  read: boolean
}

type Profile = {
  name: string
  email: string
  role: string
  timezone: string
}

type Preferences = {
  compactTables: boolean
  weeklyDigest: boolean
  liveUpdates: boolean
  currency: 'USD' | 'EUR' | 'GBP'
}

type CrmState = {
  filters: Filters
  search: string
  notifications: Notification[]
  profile: Profile
  preferences: Preferences
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  setRange: (range: DateRange) => void
  resetFilters: () => void
  setSearch: (value: string) => void
  markAllRead: () => void
  updateProfile: (patch: Partial<Profile>) => void
  updatePreferences: (patch: Partial<Preferences>) => void
}

const initialFilters: Filters = {
  range: '30d',
  team: 'All teams',
  department: 'All departments',
  region: 'All regions',
  product: 'All products',
  source: 'All sources',
}

export const useCrmStore = create<CrmState>((set) => ({
  filters: initialFilters,
  search: '',
  notifications: [
    { id: 'n1', title: 'Quota alert', body: 'Mid-Market is 12% behind pace for the quarter.', read: false },
    { id: 'n2', title: 'Deal won', body: 'Sarah closed Northwind for $48,000.', read: false },
    { id: 'n3', title: 'Pipeline review', body: 'Weekly forecast review starts in 30 minutes.', read: true },
  ],
  profile: {
    name: 'Alex Moreau',
    email: 'alex.moreau@northstar.io',
    role: 'Head of Revenue',
    timezone: 'Europe/Paris',
  },
  preferences: {
    compactTables: false,
    weeklyDigest: true,
    liveUpdates: true,
    currency: 'USD',
  },
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setRange: (range) => set((state) => ({ filters: { ...state.filters, range } })),
  resetFilters: () => set({ filters: initialFilters }),
  setSearch: (value) => set({ search: value }),
  markAllRead: () =>
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),
  updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
  updatePreferences: (patch) => set((state) => ({ preferences: { ...state.preferences, ...patch } })),
}))

export const useFilters = () => useCrmStore((s) => s.filters)
