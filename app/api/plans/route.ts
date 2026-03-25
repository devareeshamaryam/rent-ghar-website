 import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Plan from '@/models/Plan'

export async function GET() {
  try {
    await connectDB()
    const plans = await Plan.find({ isActive: true })
      .sort({ sortOrder: 1, price: 1 })
      .lean()
    return NextResponse.json({ success: true, plans })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Plans fetch karne mein error aayi' },
      { status: 500 }
    )
  }
}