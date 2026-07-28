'use client'

import { CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CURRENCY_LABELS, CURRENCY_OPTIONS, fetchExchangeRate, type CurrencyCode } from '@/lib/currency'
import { useCrmStore } from '@/lib/store'

const TIMEZONES = ['Europe/Paris', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Singapore']

export default function SettingsPage() {
  const profile = useCrmStore((s) => s.profile)
  const preferences = useCrmStore((s) => s.preferences)
  const updateProfile = useCrmStore((s) => s.updateProfile)
  const updatePreferences = useCrmStore((s) => s.updatePreferences)
  const notifications = useCrmStore((s) => s.notifications)
  const markAllRead = useCrmStore((s) => s.markAllRead)

  const [draft, setDraft] = useState(profile)
  const dirty =
    draft.name !== profile.name ||
    draft.email !== profile.email ||
    draft.role !== profile.role ||
    draft.timezone !== profile.timezone

  const handleCurrencyChange = async (value: string) => {
    const nextCurrency = value as CurrencyCode

    try {
      const rate = nextCurrency === 'USD' ? 1 : await fetchExchangeRate('USD', nextCurrency)
      updatePreferences({ currency: nextCurrency, currencyRate: rate })
      toast.success(`Dashboard values will now display in ${CURRENCY_LABELS[nextCurrency]}`)
    } catch {
      toast.error('Unable to update currency conversion right now.')
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile, workspace preferences and how SalesPilot notifies you."
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>This information appears on shared reports and forecast exports.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input
                    id="name"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Work email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  />
                  <FieldDescription>Used for the weekly digest and quota alerts.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Input
                    id="role"
                    value={draft.role}
                    onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <Select
                    items={TIMEZONES.map((zone) => ({ label: zone, value: zone }))}
                    value={draft.timezone}
                    onValueChange={(value) => setDraft({ ...draft, timezone: value as string })}
                  >
                    <SelectTrigger id="timezone" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {TIMEZONES.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>All dashboard timestamps are rendered in this timezone.</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setDraft(profile)} disabled={!dirty}>
                Discard
              </Button>
              <Button
                disabled={!dirty}
                onClick={() => {
                  updateProfile(draft)
                  toast.success('Profile updated')
                }}
              >
                <CheckIcon data-icon="inline-start" />
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Workspace preferences</CardTitle>
              <CardDescription>Control how dashboards render and refresh for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend variant="label">Display</FieldLegend>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Switch
                        id="compact"
                        checked={preferences.compactTables}
                        onCheckedChange={(checked) => updatePreferences({ compactTables: checked })}
                      />
                      <FieldContentRow
                        htmlFor="compact"
                        label="Compact tables"
                        description="Reduce row height to fit more data on screen."
                      />
                    </Field>
                    <Field orientation="horizontal">
                      <Switch
                        id="live"
                        checked={preferences.liveUpdates}
                        onCheckedChange={(checked) => updatePreferences({ liveUpdates: checked })}
                      />
                      <FieldContentRow
                        htmlFor="live"
                        label="Live updates"
                        description="Refetch metrics automatically while the tab is focused."
                      />
                    </Field>
                    <Field orientation="horizontal">
                      <Switch
                        id="digest"
                        checked={preferences.weeklyDigest}
                        onCheckedChange={(checked) => updatePreferences({ weeklyDigest: checked })}
                      />
                      <FieldContentRow
                        htmlFor="digest"
                        label="Weekly digest"
                        description="Email a Monday summary of pipeline and quota attainment."
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <Field>
                  <FieldLabel htmlFor="currency">Reporting currency</FieldLabel>
                  <Select
                    items={CURRENCY_OPTIONS.map((currency) => ({ label: CURRENCY_LABELS[currency], value: currency }))}
                    value={preferences.currency}
                    onValueChange={(value) => {
                      if (value) {
                        void handleCurrencyChange(value)
                      }
                    }}
                  >
                    <SelectTrigger id="currency" className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CURRENCY_OPTIONS.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {CURRENCY_LABELS[currency]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>Amounts are converted from USD using the latest available reference rate.</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Alerts raised by quota pacing, deal movement and scheduled reviews.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{notification.body}</p>
                    </div>
                    {notification.read ? null : <Badge>New</Badge>}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  markAllRead()
                  toast.success('All notifications marked as read')
                }}
                disabled={notifications.every((notification) => notification.read)}
              >
                Mark all as read
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

function FieldContentRow({
  htmlFor,
  label,
  description,
}: {
  htmlFor: string
  label: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <FieldLabel htmlFor={htmlFor} className="font-medium">
        {label}
      </FieldLabel>
      <FieldDescription>{description}</FieldDescription>
    </div>
  )
}
