'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  CircleDotIcon,
  FileTextIcon,
  MoveRightIcon,
  TrophyIcon,
  UserPlusIcon,
  XCircleIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatCurrency } from '@/lib/format'
import type { ActivityItem } from '@/lib/types'

const ICONS = {
  won: TrophyIcon,
  lost: XCircleIcon,
  lead: UserPlusIcon,
  stage: MoveRightIcon,
  note: FileTextIcon,
} as const

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Live pipeline events across the workspace.</CardDescription>
        <CardAction>
          <Badge variant="secondary" className="gap-1.5">
            <CircleDotIcon className="size-3 text-success" />
            Live
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-3">
          <ul className="flex flex-col">
            {items.map((item) => {
              const Icon = ICONS[item.kind]
              return (
                <li key={item.id} className="flex items-start gap-3 border-b border-border py-3 last:border-0">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-[11px]">{item.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium">{item.actor}</span>{' '}
                      <span className="text-muted-foreground">{item.action}</span>{' '}
                      <span className="font-medium">{item.target}</span>
                      {item.amount ? (
                        <span className="font-mono text-sm tabular-nums"> · {formatCurrency(item.amount)}</span>
                      ) : null}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.at), { addSuffix: true })}
                    </span>
                  </div>
                  <Icon
                    className={
                      item.kind === 'won'
                        ? 'size-4 shrink-0 text-success'
                        : item.kind === 'lost'
                          ? 'size-4 shrink-0 text-destructive'
                          : 'size-4 shrink-0 text-muted-foreground'
                    }
                  />
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
