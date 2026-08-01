import { NextRequest, NextResponse } from 'next/server'
import { ActivityKind, DealStage } from '@/lib/generated/prisma/client'
import { AuthError, requireSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { buildDealWhere, normalizeFilters } from '@/lib/filters'
import { createDealSchema } from '@/lib/validators/deal'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    await requireSession(request)
    const { searchParams } = new URL(request.url)
    const filters = normalizeFilters(searchParams)
    const where = buildDealWhere(filters)

    const deals = await db.deal.findMany({
      where,
      include: { rep: true, product: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ deals })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request)
    const body = createDealSchema.parse(await request.json())

    const repId = body.repId ?? session.id
    const deal = await db.deal.create({
      data: {
        title: body.title,
        amount: body.amount,
        stage: (body.stage as DealStage) ?? DealStage.LEADS,
        source: body.source,
        region: body.region,
        repId,
        productId: body.productId,
        closedAt: body.stage === 'WON' ? new Date() : null,
      },
      include: { rep: true, product: true },
    })

    await db.activity.create({
      data: {
        kind: ActivityKind.LEAD,
        action: 'added a new deal',
        target: deal.title,
        amount: deal.amount,
        userId: session.id,
        dealId: deal.id,
      },
    })

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
