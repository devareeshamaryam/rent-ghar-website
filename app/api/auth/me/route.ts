 // app/api/auth/me/route.ts
// Logged in user ki info return karta hai token se

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

    await connectDB()

    const user = await User.findById(payload.id).select('-password')
    if (!user)
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })

    return NextResponse.json({
      success: true,
      user: {
        id:       user._id,
        name:     user.name,
        email:    user.email,
        role:     user.role,
        phone:    user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}