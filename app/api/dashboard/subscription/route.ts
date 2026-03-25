 import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongoose'
import Plan from '@/models/Plan'
import UserSubscription from '@/models/UserSubscription'
import { verifyToken } from '@/lib/jwt'

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

// GET /api/dashboard/subscription
export async function GET() {
  const payload = await getUser()
  if (!payload) {
    return NextResponse.json({ success: false, message: 'Login karein' }, { status: 401 })
  }
  try {
    await connectDB()
    const subscription = await UserSubscription.findOne({
      userId: new mongoose.Types.ObjectId(payload.id),
      status: 'active',
    })
      .populate('planId')
      .lean()
    return NextResponse.json({ success: true, subscription })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Subscription fetch karne mein error aayi' },
      { status: 500 }
    )
  }
}

// POST /api/dashboard/subscription
export async function POST(req: NextRequest) {
  const payload = await getUser()
  if (!payload) {
    return NextResponse.json({ success: false, message: 'Login karein' }, { status: 401 })
  }
  try {
    await connectDB()
    const { planId } = await req.json()
    if (!planId) {
      return NextResponse.json({ success: false, message: 'planId zaroori hai' }, { status: 400 })
    }

    const plan = await Plan.findById(planId)
    if (!plan || !plan.isActive) {
      return NextResponse.json({ success: false, message: 'Plan nahi mila ya inactive hai' }, { status: 404 })
    }

    const userId = new mongoose.Types.ObjectId(payload.id)

    // Purana subscription cancel karo
    await UserSubscription.updateMany({ userId, status: 'active' }, { status: 'cancelled' })

    const endDate = plan.billingCycle === 'one-time'
      ? null
      : new Date(Date.now() + (plan.billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)

    const subscription = await UserSubscription.create({
      userId,
      planId: plan._id,
      status: 'active',
      startDate: new Date(),
      endDate,
    })

    const populated = await subscription.populate('planId')
    return NextResponse.json({ success: true, subscription: populated }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Subscribe karne mein error aayi' },
      { status: 500 }
    )
  }
}

// DELETE /api/dashboard/subscription
export async function DELETE() {
  const payload = await getUser()
  if (!payload) {
    return NextResponse.json({ success: false, message: 'Login karein' }, { status: 401 })
  }
  try {
    await connectDB()
    await UserSubscription.updateMany(
      { userId: new mongoose.Types.ObjectId(payload.id), status: 'active' },
      { status: 'cancelled' }
    )
    return NextResponse.json({ success: true, message: 'Subscription cancel ho gaya' })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Cancel karne mein error aayi' },
      { status: 500 }
    )
  }
}