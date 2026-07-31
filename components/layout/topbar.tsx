'use client'

import { useEffect, useState } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { BellIcon, CheckIcon, LogOutIcon, MoonIcon, SearchIcon, SunIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/lib/auth-client'
import { useCrmStore } from '@/lib/store'
import { DateRangePicker } from './date-range-picker'

export function Topbar() {
  const search = useCrmStore((s) => s.search)
  const setSearch = useCrmStore((s) => s.setSearch)
  const notifications = useCrmStore((s) => s.notifications)
  const markAllRead = useCrmStore((s) => s.markAllRead)
  const profile = useCrmStore((s) => s.profile)
  const { logout } = useAuth()
  const isFetching = useIsFetching()
  const unread = notifications.filter((n) => !n.read).length
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === 'dark' : false

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md md:px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />

      <div className="relative hidden max-w-sm flex-1 items-center md:flex">
        <SearchIcon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search deals, reps, products..."
          aria-label="Global search"
          className="h-8 pl-8"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {isFetching > 0 ? (
          <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Spinner className="size-3.5" />
            Syncing
          </span>
        ) : null}

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>

        <DateRangePicker />

        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <BellIcon />
                {unread > 0 ? (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
                ) : null}
              </Button>
            }
          />
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2.5">
              <p className="text-sm font-medium">Notifications</p>
              <Button variant="ghost" size="sm" onClick={markAllRead} disabled={unread === 0}>
                <CheckIcon data-icon="inline-start" />
                Mark all read
              </Button>
            </div>
            <Separator />
            <ul className="flex flex-col">
              {notifications.map((item) => (
                <li key={item.id} className="flex flex-col gap-1 border-b border-border px-3 py-2.5 last:border-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    {!item.read ? (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                        New
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 gap-2 px-1.5" aria-label="Account menu">
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm sm:inline">{profile.name}</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{profile.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{profile.email}</span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <UserIcon />
                Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => logout()}>
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
