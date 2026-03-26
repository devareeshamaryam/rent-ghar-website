 // app/api/featured/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import FeaturedListing from '@/models/FeaturedListing'

export async function GET() {
  try {
    await connectDB()

    const now = new Date()

    const featured = await FeaturedListing.find({
      isActive: true,
      startDate: { $lte: now },
      endDate:   { $gte: now },
    })
      .populate({
        path: 'property',
        select: 'title slug purpose price marla kanal bedrooms bathrooms mainPhoto city area propertyType',
        populate: [
          { path: 'city',         select: 'name slug' },
          { path: 'area',         select: 'name slug' },
          { path: 'propertyType', select: 'name'      },
        ],
      })
      .sort({ createdAt: -1 })
      .lean()

    const valid = featured.filter((f: any) => f.property)

    return NextResponse.json({ success: true, data: valid }, { status: 200 })
  } catch (error) {
    console.error('GET /api/featured error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    // ✅ frontend propertyId bhejta hai, dono accept karo
    const propertyId = body.propertyId || body.property
    const { startDate, endDate, priority, isActive } = body

    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'property, startDate aur endDate required hain' },
        { status: 400 }
      )
    }

    const listing = await FeaturedListing.create({
      property:  propertyId,
      startDate: new Date(startDate),
      endDate:   new Date(endDate),
      priority:  priority ?? 0,
      isActive:  isActive ?? true,
    })

    return NextResponse.json({ success: true, data: listing }, { status: 201 })
  } catch (error) {
    console.error('POST /api/featured error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}