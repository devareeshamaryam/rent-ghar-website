import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import PropertyType from '@/models/PropertyType'

// GET /api/types
export async function GET() {
  try {
    await connectDB()
    const types = await PropertyType.find({ isActive: true }).sort({ name: 1 })
    return NextResponse.json({ success: true, data: types })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch types' }, { status: 500 })
  }
}

// POST /api/types
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name } = await req.json()

    if (!name?.trim()) return NextResponse.json({ success: false, message: 'Type name is required' }, { status: 400 })

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const exists = await PropertyType.findOne({ slug })
    if (exists) return NextResponse.json({ success: false, message: 'Type already exists' }, { status: 409 })

    const type = await PropertyType.create({ name: name.trim(), slug })
    return NextResponse.json({ success: true, data: type }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to create type' }, { status: 500 })
  }
}