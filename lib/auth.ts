import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export const AUTH_COOKIE = 'auth-token'

export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return new TextEncoder().encode(secret)
}

function getExpiresInSeconds() {
  const raw = process.env.JWT_EXPIRES_IN
  return raw ? Number.parseInt(raw, 10) : 60 * 60 * 24 * 7
}

export async function signToken(user: SessionUser) {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${getExpiresInSeconds()}s`)
    .sign(getJwtSecret())
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    const id = payload.sub
    if (!id || typeof id !== 'string') return null
    return {
      id,
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      role: String(payload.role ?? 'REP'),
    }
  } catch {
    return null
  }
}

export function authCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireSession(request: NextRequest): Promise<SessionUser> {
  const session = await getSessionFromRequest(request)
  if (!session) throw new AuthError('Unauthorized', 401)
  return session
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status = 401) {
    super(message)
    this.status = status
  }
}

export { authenticateUser, hashPassword } from './auth-server'
