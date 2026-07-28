'use client'

import {
  ChartLineIcon,
  FilterIcon,
  GaugeIcon,
  LifeBuoyIcon,
  PackageIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useCrmStore } from '@/lib/store'

const NAV = [
  { title: 'Overview', href: '/', icon: GaugeIcon },
  { title: 'Revenue', href: '/revenue', icon: ChartLineIcon },
  { title: 'Team', href: '/team', icon: UsersIcon },
  { title: 'Funnel', href: '/funnel', icon: FilterIcon },
  { title: 'Products', href: '/products', icon: PackageIcon },
]

export function AppSidebar() {
  const pathname = usePathname()
  const unread = useCrmStore((s) => s.notifications.filter((n) => !n.read).length)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />} tooltip="SalesPilot CRM">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-sm font-semibold text-primary-foreground">
                S
              </span>
              <span className="flex flex-col gap-0.5 leading-none">
                <span className="text-sm font-semibold">SalesPilot</span>
                <span className="text-xs text-muted-foreground">Revenue OS</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.title === 'Funnel' && unread > 0 ? (
                    <SidebarMenuBadge>{unread}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === '/settings'}
                  tooltip="Settings"
                  render={<Link href="/settings" />}
                >
                  <SettingsIcon />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Support" render={<Link href="/support" />}>
              <LifeBuoyIcon />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
