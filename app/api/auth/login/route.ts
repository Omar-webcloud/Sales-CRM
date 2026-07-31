import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, AuthError, authenticateUser, authCookieOptions, requireSession, signToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validators/auth'

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json())
    const user = await authenticateUser(body.email, body.password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken(user)
    const maxAge = Number.parseInt(process.env.JWT_EXPIRES_IN ?? '604800', 10)
    const response = NextResponse.json({ user })
    response.cookies.set(AUTH_COOKIE, token, authCookieOptions(maxAge))
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request)
    return NextResponse.json({ user: session })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
