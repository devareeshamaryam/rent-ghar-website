import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Area from '@/models/Area'

// GET /api/areas?city=cityId
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const cityId = req.nextUrl.searchParams.get('city')
    const filter: Record<string, unknown> = { isActive: true }
    if (cityId) filter.city = cityId

    const areas = await Area.find(filter)
      .populate('city', 'name slug')
      .sort({ name: 1 })

    return NextResponse.json({ success: true, data: areas })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch areas' }, { status: 500 })
  }
}

// POST /api/areas
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, city } = await req.json()

    if (!name?.trim()) return NextResponse.json({ success: false, message: 'Area name is required' }, { status: 400 })
    if (!city)         return NextResponse.json({ success: false, message: 'City is required' }, { status: 400 })

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const exists = await Area.findOne({ slug, city })
    if (exists) return NextResponse.json({ success: false, message: 'Area already exists in this city' }, { status: 409 })

    const area = await Area.create({ name: name.trim(), slug, city })
    const populated = await area.populate('city', 'name slug')
    return NextResponse.json({ success: true, data: populated }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to create area' }, { status: 500 })
  }
}