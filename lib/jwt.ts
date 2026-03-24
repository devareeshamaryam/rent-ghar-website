 // lib/jwt.ts
// signToken   → jsonwebtoken (API routes / server side)
// verifyToken → jsonwebtoken (API routes / server side)
// verifyTokenEdge → jose (middleware / edge runtime)

import jwt from 'jsonwebtoken'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) throw new Error('JWT_SECRET not defined in .env.local')

export interface JwtPayload {
  id:    string
  email: string
  role:  'user' | 'admin'
  name:  string
}

// ── Server side (API routes) ──────────────────────────────

// Token generate karo — 7 din expire
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Token verify karo — server side only
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

// ── Edge Runtime (middleware) ─────────────────────────────

// jose use karta hai — middleware mein yahi use karo
export async function verifyTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}