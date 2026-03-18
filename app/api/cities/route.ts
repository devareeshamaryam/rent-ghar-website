 import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import City from '@/models/City'

// GET /api/cities
export async function GET() {
  try {
    await connectDB()
    const cities = await City.find({ isActive: true }).sort({ name: 1 })
    return NextResponse.json({ success: true, data: cities })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch cities' }, { status: 500 })
  }
}

// POST /api/cities
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'City name is required' }, { status: 400 })
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const exists = await City.findOne({ slug })
    if (exists) {
      return NextResponse.json({ success: false, message: 'City already exists' }, { status: 409 })
    }

    const city = await City.create({ name: name.trim(), slug })
    return NextResponse.json({ success: true, data: city }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to create city' }, { status: 500 })
  }
}