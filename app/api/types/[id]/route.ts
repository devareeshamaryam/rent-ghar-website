import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import PropertyType from '@/models/PropertyType'

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const type = await PropertyType.findById(params.id)
    if (!type) return NextResponse.json({ success: false, message: 'Type not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: type })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch type' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { name, isActive } = await req.json()
    const slug = name?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const type = await PropertyType.findByIdAndUpdate(
      params.id,
      {
        ...(name     && { name: name.trim(), slug }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    )
    if (!type) return NextResponse.json({ success: false, message: 'Type not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: type })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update type' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const type = await PropertyType.findByIdAndDelete(params.id)
    if (!type) return NextResponse.json({ success: false, message: 'Type not found' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Type deleted' })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to delete type' }, { status: 500 })
  }
}