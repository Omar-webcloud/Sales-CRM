import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Helpful tips for using the dashboard and developer contact details for one-on-one support."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>How to use the app</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>Start with the sidebar navigation to explore dashboards for Overview, Revenue, Team, Funnel, and Products.</p>
              <p>Use the search input in the topbar to quickly find deals, reps, products, and other records.</p>
              <p>The dark/light toggle in the topbar follows your device setting by default and lets you switch manually at any time.</p>
              <p>Open the profile menu in the top right to access your profile settings or sign out.</p>
            </div>
            <div className="grid gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">Tip</span>
                <Badge variant="secondary">Recommended</Badge>
              </div>
              <p className="text-muted-foreground">Keep the workspace sidebar open while working with reports so you can jump between dashboards instantly.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Contact developer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>If you need support, reach out directly to the developer for technical questions and feedback.</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Website</p>
                <a
                  href="https://omarwebcloud.netlify.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-2 decoration-muted/50 hover:text-primary"
                >
                  omarwebcloud.netlify.app
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</p>
                <a
                  href="mailto:omarfarukcihs@gmail.com"
                  className="text-foreground underline underline-offset-2 decoration-muted/50 hover:text-primary"
                >
                  omarfarukcihs@gmail.com
                </a>
              </div>
            </div>
            <Separator />
            <div className="rounded-lg bg-background/80 p-4 text-sm text-foreground shadow-sm ring-1 ring-border">
              <p className="font-medium">Need urgent help?</p>
              <p className="text-muted-foreground">Send a message with your issue and include any screenshot or error details.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
