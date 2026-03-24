 // Route: POST /api/auth/login
// Email + password se login karta hai, JWT cookie set karta hai

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    // Validation
    if (!email?.trim())
      return NextResponse.json({ success: false, message: 'Email is required' },    { status: 400 })
    if (!password)
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 })

    // User dhundo
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user)
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })

    // Account active check
    if (!user.isActive)
      return NextResponse.json({ success: false, message: 'Account is disabled. Contact support.' }, { status: 403 })

    // Password verify
    const isMatch = await user.comparePassword(password)
    if (!isMatch)
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })

    // JWT_SECRET check — agar missing ho toh clear error
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in .env.local')
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 })
    }

    // Token sign karo
    const token = signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.name,
    })

    // Response banao
    const res = NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    })

    // Cookie set karo
    res.cookies.set('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 din
      path:     '/',
    })

    return res

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: 'Login failed. Please try again.' }, { status: 500 })
  }
}