// app/api/user/properties/route.ts
// Sirf logged-in user ki apni properties return karta hai

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import { verifyToken } from '@/lib/jwt'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token)
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload)
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    await connectDB()

    const db = mongoose.connection.db
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10')

    // User ki apni properties — owner field se match karo
    const properties = await db
      .collection('properties')
      .find({ owner: new mongoose.Types.ObjectId(payload.id) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    // Stats calculate karo
    const total  = properties.length
    const active = properties.filter((p: any) => p.status === 'active').length
    const views  = properties.reduce((sum: number, p: any) => sum + (p.views || 0), 0)

    return NextResponse.json({
      success: true,
      stats: { total, active, views },
      data:   properties,
    })
  } catch (error) {
    console.error('User properties error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}