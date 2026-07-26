'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatCurrency, formatNumber } from '@/lib/format'

type BarChartCardProps = {
  title: string
  description: string
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  label: string
  valueFormat?: 'currency' | 'number'
  layout?: 'horizontal' | 'vertical'
  color?: string
  className?: string
}

export function BarChartCard({
  title,
  description,
  data,
  xKey,
  yKey,
  label,
  valueFormat = 'currency',
  layout = 'horizontal',
  color = 'var(--chart-1)',
  className,
}: BarChartCardProps) {
  const config = { [yKey]: { label, color } }
  const format = (value: number) => (valueFormat === 'currency' ? formatCurrency(value, true) : formatNumber(value))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[280px] w-full">
          <BarChart data={data} layout={layout} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={layout === 'horizontal'}
              vertical={layout === 'vertical'}
            />
            {layout === 'horizontal' ? (
              <>
                <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} width={62} tickFormatter={format} />
              </>
            ) : (
              <>
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={format} />
                <YAxis dataKey={xKey} type="category" tickLine={false} axisLine={false} width={124} />
              </>
            )}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (valueFormat === 'currency' ? formatCurrency(Number(value)) : formatNumber(Number(value)))}
                />
              }
            />
            <Bar dataKey={yKey} fill={`var(--color-${yKey})`} radius={[6, 6, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
