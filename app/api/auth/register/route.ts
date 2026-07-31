import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@/lib/generated/prisma'
import { hashPassword, signToken, AUTH_COOKIE, authCookieOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { registerSchema } from '@/lib/validators/auth'

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json())
    const email = body.email.toLowerCase()

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await hashPassword(body.password)
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name: body.name,
        role: Role.REP,
        team: body.team ?? 'SMB',
        department: body.department ?? 'Inbound',
        preferences: { create: {} },
      },
    })

    const session = { id: user.id, email: user.email, name: user.name, role: user.role }
    const token = await signToken(session)
    const maxAge = Number.parseInt(process.env.JWT_EXPIRES_IN ?? '604800', 10)
    const response = NextResponse.json({ user: session })
    response.cookies.set(AUTH_COOKIE, token, authCookieOptions(maxAge))
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
