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

// PUT /api/admin/plans/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const body = await req.json()
    const { id } = params

    const plan = await Plan.findById(id)
    if (!plan) {
      return NextResponse.json({ success: false, message: 'Plan nahi mila' }, { status: 404 })
    }

    const { name, description, price, billingCycle, features, limits, isActive, isPopular, sortOrder } = body

    if (name        !== undefined) plan.name        = name.trim()
    if (description !== undefined) plan.description = description
    if (price       !== undefined) plan.price       = Number(price)
    if (billingCycle !== undefined) plan.billingCycle = billingCycle
    if (features    !== undefined) plan.features    = features
    if (isActive    !== undefined) plan.isActive    = isActive
    if (isPopular   !== undefined) plan.isPopular   = isPopular
    if (sortOrder   !== undefined) plan.sortOrder   = sortOrder

    if (limits) {
      plan.limits = {
        maxProperties:    limits.maxProperties    ?? plan.limits.maxProperties,
        maxImages:        limits.maxImages        ?? plan.limits.maxImages,
        featuredListings: limits.featuredListings ?? plan.limits.featuredListings,
        prioritySupport:  limits.prioritySupport  ?? plan.limits.prioritySupport,
        analytics:        limits.analytics        ?? plan.limits.analytics,
      }
    }

    await plan.save()
    return NextResponse.json({ success: true, plan })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Plan update karne mein error aayi' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/plans/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const { id } = params
    const plan = await Plan.findByIdAndDelete(id)
    if (!plan) {
      return NextResponse.json({ success: false, message: 'Plan nahi mila' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'Plan delete ho gaya' })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Plan delete karne mein error aayi' },
      { status: 500 }
    )
  }
}