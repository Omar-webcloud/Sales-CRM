import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import type { SessionUser } from './auth'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
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

export async function authenticateUser(email: string, password: string) {
  const { db } = await import('./db')
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return null
  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  } satisfies SessionUser
}
