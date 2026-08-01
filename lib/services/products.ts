import { format, subMonths } from 'date-fns'
import { DealStage } from '@/lib/generated/prisma/client'
import { db } from '@/lib/db'
import { buildDealWhere } from '@/lib/filters'
import type { Filters, ProductsData } from '@/lib/types'
import { money } from './helpers'

export async function getProductsFromDb(filters: Filters): Promise<ProductsData> {
  const where = buildDealWhere(filters)
  const deals = await db.deal.findMany({
    where,
    include: { product: true },
  })

  const products = await db.product.findMany({
    where: filters.product !== 'All products' ? { name: filters.product } : undefined,
    orderBy: { name: 'asc' },
  })

  const rows = products.map((product) => {
    const productDeals = deals.filter((d) => d.productId === product.id)
    const wonDeals = productDeals.filter((d) => d.stage === DealStage.WON)
    const revenue = wonDeals.reduce((sum, d) => sum + d.amount, 0)
    const dealCount = productDeals.length
    const wonCount = wonDeals.length

    const threeMonthsAgo = subMonths(new Date(), 3)
    const recentWon = wonDeals.filter((d) => d.createdAt >= threeMonthsAgo).reduce((s, d) => s + d.amount, 0)
    const olderWon = wonDeals.filter((d) => d.createdAt < threeMonthsAgo).reduce((s, d) => s + d.amount, 0)
    const growth = olderWon === 0 ? 0 : Math.round(((recentWon - olderWon) / olderWon) * 1000) / 10

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      revenue: money(revenue),
      deals: dealCount,
      conversion: dealCount > 0 ? Math.round((wonCount / dealCount) * 1000) / 10 : 0,
      growth,
      arpa: money(dealCount > 0 ? revenue / dealCount : 0),
    }
  })

  const sorted = [...rows].sort((a, b) => b.revenue - a.revenue)
  const trendKeys = sorted.slice(0, 4).map((p) => p.name)

  const trend = Array.from({ length: 12 }, (_, idx) => {
    const monthDate = subMonths(new Date(), 11 - idx)
    const row: { label: string; [product: string]: number | string } = {
      label: format(monthDate, 'MMM'),
    }
    trendKeys.forEach((name) => {
      const product = products.find((p) => p.name === name)!
      const monthDeals = deals.filter(
        (d) =>
          d.productId === product.id &&
          d.stage === DealStage.WON &&
          d.createdAt.getMonth() === monthDate.getMonth() &&
          d.createdAt.getFullYear() === monthDate.getFullYear(),
      )
      row[name] = money(monthDeals.reduce((s, d) => s + d.amount, 0))
    })
    return row
  })

  return {
    products: sorted,
    top: sorted.map((p) => ({ name: p.name, revenue: p.revenue })),
    trend,
    trendKeys,
  }
}
