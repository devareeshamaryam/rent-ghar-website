import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Area from '@/models/Area'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const area = await Area.findById(params.id).populate('city', 'name slug')
    if (!area) return NextResponse.json({ success: false, message: 'Area not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: area })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch area' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { name, city, isActive } = await req.json()
    const slug = name?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const area = await Area.findByIdAndUpdate(
      params.id,
      {
        ...(name     && { name: name.trim(), slug }),
        ...(city     && { city }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    ).populate('city', 'name slug')
    if (!area) return NextResponse.json({ success: false, message: 'Area not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: area })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update area' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const area = await Area.findByIdAndDelete(params.id)
    if (!area) return NextResponse.json({ success: false, message: 'Area not found' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Area deleted' })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to delete area' }, { status: 500 })
  }
}