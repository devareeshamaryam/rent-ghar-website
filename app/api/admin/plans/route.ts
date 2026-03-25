 import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import connectDB from '@/lib/mongoose'
import Plan from '@/models/Plan'
import { verifyToken } from '@/lib/jwt'

async function isAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

// GET /api/admin/plans
export async function GET(req: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const plans = await Plan.find().sort({ sortOrder: 1, createdAt: -1 }).lean()
    return NextResponse.json({ success: true, plans })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Plans fetch karne mein error aayi' },
      { status: 500 }
    )
  }
}

// POST /api/admin/plans
export async function POST(req: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const body = await req.json()
    const { name, description, price, billingCycle, features, limits, isActive, isPopular, sortOrder } = body

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Name, description aur price zaroori hain' },
        { status: 400 }
      )
    }

    const existing = await Plan.findOne({ name: name.trim() })
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Is naam ka plan pehle se exist karta hai' },
        { status: 409 }
      )
    }

    const plan = await Plan.create({
      name: name.trim(),
      description,
      price: Number(price),
      billingCycle: billingCycle || 'monthly',
      features: features || [],
      limits: {
        maxProperties:    limits?.maxProperties    ?? 3,
        maxImages:        limits?.maxImages        ?? 5,
        featuredListings: limits?.featuredListings ?? false,
        prioritySupport:  limits?.prioritySupport  ?? false,
        analytics:        limits?.analytics        ?? false,
      },
      isActive:  isActive  ?? true,
      isPopular: isPopular ?? false,
      sortOrder: sortOrder ?? 0,
    })

    return NextResponse.json({ success: true, plan }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Plan create karne mein error aayi' },
      { status: 500 }
    )
  }
}