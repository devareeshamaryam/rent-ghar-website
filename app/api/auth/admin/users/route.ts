// app/api/admin/users/route.ts
// Sirf admin access kar sakta hai — sab registered users ka data

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import { verifyToken } from '@/lib/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token)
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload)
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    // Sirf admin allow hai
    if (payload.role !== 'admin')
      return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 })

    await connectDB()

    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })

    const totalUsers  = users.length
    const activeUsers = users.filter(u => u.isActive).length

    return NextResponse.json({
      success: true,
      stats: { totalUsers, activeUsers },
      data:   users,
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}