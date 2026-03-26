 import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import City from '@/models/City'

// ── GET /api/cities ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const slug    = searchParams.get('slug')
    const purpose = searchParams.get('purpose')   // 'rent' | 'buy'
    const typeId  = searchParams.get('typeId')     // propertyType _id

    // Fetch single city by slug (used by frontend for SEO)
    if (slug) {
      const city = await City.findOne({ slug, isActive: true })
        .populate('propertyTypeContent.propertyType', 'name')

      if (!city) {
        return NextResponse.json({ success: false, message: 'City not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: city })
    }

    // Fetch all active cities (used by dropdowns)
    const cities = await City.find({ isActive: true }).sort({ name: 1 })
      .select('_id name slug thumbnail state country')  // lean for dropdowns

    return NextResponse.json({ success: true, data: cities })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch cities' }, { status: 500 })
  }
}

// ── POST /api/cities ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const {
      name,
      state, country, thumbnail,
      metaTitle, metaDescription, canonicalUrl, description,
      rentMetaTitle, rentMetaDescription, rentContent,
      buyMetaTitle,  buyMetaDescription,  buyContent,
      propertyTypeContent = [],
    } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'City name is required' },
        { status: 400 }
      )
    }

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const exists = await City.findOne({ slug })
    if (exists) {
      return NextResponse.json(
        { success: false, message: 'City already exists' },
        { status: 409 }
      )
    }

    // Filter out property-type blocks without a propertyType selected
    const validPtContent = (propertyTypeContent as {
      propertyType: string
      purpose:      string
      metaTitle:    string
      metaDescription: string
      content:      string
    }[]).filter(b => b.propertyType)

    const city = await City.create({
      name: name.trim(),
      slug,
      state:     state     || '',
      country:   country   || '',
      thumbnail: thumbnail || '',

      metaTitle:       metaTitle       || '',
      metaDescription: metaDescription || '',
      canonicalUrl:    canonicalUrl    || '',
      description:     description     || '',

      rentMetaTitle:       rentMetaTitle       || '',
      rentMetaDescription: rentMetaDescription || '',
      rentContent:         rentContent         || '',

      buyMetaTitle:       buyMetaTitle       || '',
      buyMetaDescription: buyMetaDescription || '',
      buyContent:         buyContent         || '',

      propertyTypeContent: validPtContent,
    })

    return NextResponse.json({ success: true, data: city }, { status: 201 })
  } catch (err: unknown) {
    console.error('POST /api/cities error:', err)
    return NextResponse.json(
      { success: false, message: 'Failed to create city' },
      { status: 500 }
    )
  }
}