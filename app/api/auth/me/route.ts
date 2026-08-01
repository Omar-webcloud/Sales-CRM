import { NextRequest, NextResponse } from 'next/server'
import { AuthError, requireSession } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request)
    const user = await db.user.findUnique({
      where: { id: session.id },
      include: { preferences: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        timezone: user.timezone,
        team: user.team,
        department: user.department,
        preferences: user.preferences,
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
