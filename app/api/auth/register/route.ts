// Route: POST /api/auth/register
// Naya user account banata hai

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const { name, email, password, phone } = await req.json()

    // Validate
    if (!name?.trim())     return NextResponse.json({ success: false, message: 'Name is required' },     { status: 400 })
    if (!email?.trim())    return NextResponse.json({ success: false, message: 'Email is required' },    { status: 400 })
    if (!password)         return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 })

    // Check duplicate
    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 })

    // Create user
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password,
      phone:    phone?.trim() || '',
      role:     'user',
    })

    // Sign token
    const token = signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.name,
    })

    // Set cookie
    const res = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 })

    res.cookies.set('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7, // 7 days
      path:     '/',
    })

    return res

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ success: false, message: 'Registration failed' }, { status: 500 })
  }
}