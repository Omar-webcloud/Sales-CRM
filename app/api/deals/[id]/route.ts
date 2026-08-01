import { NextRequest, NextResponse } from 'next/server'
import { ActivityKind, DealStage } from '@/lib/generated/prisma/client'
import { AuthError, requireSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateDealSchema } from '@/lib/validators/deal'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireSession(request)
    const { id } = await context.params
    const deal = await db.deal.findUnique({
      where: { id },
      include: { rep: true, product: true },
    })
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }
    return NextResponse.json({ deal })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await requireSession(request)
    const { id } = await context.params
    const body = updateDealSchema.parse(await request.json())

    const existing = await db.deal.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const stage = body.stage as DealStage | undefined
    const deal = await db.deal.update({
      where: { id },
      data: {
        ...body,
        stage,
        closedAt: stage === DealStage.WON ? new Date() : stage ? null : undefined,
      },
      include: { rep: true, product: true },
    })

    if (stage && stage !== existing.stage) {
      const kind =
        stage === DealStage.WON
          ? ActivityKind.WON
          : stage === DealStage.LOST
            ? ActivityKind.LOST
            : ActivityKind.STAGE
      await db.activity.create({
        data: {
          kind,
          action: stage === DealStage.WON ? 'closed a deal with' : `moved to ${stage}`,
          target: deal.title,
          amount: stage === DealStage.WON || stage === DealStage.LOST ? deal.amount : null,
          userId: session.id,
          dealId: deal.id,
        },
      })
    }

    return NextResponse.json({ deal })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireSession(request)
    const { id } = await context.params

    const existing = await db.deal.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    await db.deal.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
