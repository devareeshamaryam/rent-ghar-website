import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import City from '@/models/City'

type Params = { params: { id: string } }

// GET /api/cities/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const city = await City.findById(params.id)
    if (!city) return NextResponse.json({ success: false, message: 'City not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: city })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch city' }, { status: 500 })
  }
}

// PUT /api/cities/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { name, isActive } = await req.json()
    const slug = name?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const city = await City.findByIdAndUpdate(
      params.id,
      { ...(name && { name: name.trim(), slug }), ...(isActive !== undefined && { isActive }) },
      { new: true }
    )
    if (!city) return NextResponse.json({ success: false, message: 'City not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: city })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update city' }, { status: 500 })
  }
}

// DELETE /api/cities/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const city = await City.findByIdAndDelete(params.id)
    if (!city) return NextResponse.json({ success: false, message: 'City not found' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'City deleted' })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to delete city' }, { status: 500 })
  }
}