 // middleware.ts — project ROOT mein rakho (package.json ke saath)
// Edge runtime compatible — jose use karta hai jsonwebtoken nahi

import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenEdge } from '@/lib/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  // ── Protect /admin ──────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', req.url))
    }
    const payload = await verifyTokenEdge(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', req.url))
    }
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // ── Protect /dashboard ─────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
    }
    const payload = await verifyTokenEdge(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}