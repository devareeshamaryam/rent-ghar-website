 import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Property from '@/models/Property'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// ─── GET /api/properties ──────────────────────────────────
// Query params: city, area, type, status, page, limit
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page   = parseInt(searchParams.get('page')  || '1')
    const limit  = parseInt(searchParams.get('limit') || '10')
    const city   = searchParams.get('city')
    const area   = searchParams.get('area')
    const type   = searchParams.get('type')
    const status = searchParams.get('status') // null = all, 'active' = only active

    // Build filter — if no status param, show all (for admin)
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (city)   filter.city         = city
    if (area)   filter.area         = area
    if (type)   filter.propertyType = type

    const skip  = (page - 1) * limit
    const total = await Property.countDocuments(filter)

    const properties = await Property
      .find(filter)
      .populate('city',         'name slug')
      .populate('area',         'name slug')
      .populate('propertyType', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json({
      success: true,
      data:    properties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/properties error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// ─── POST /api/properties ─────────────────────────────────
// Accepts multipart/form-data (images + JSON fields)
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const formData = await req.formData()

    // ── Required fields ──
    const title        = formData.get('title')        as string
    const propertyType = formData.get('propertyType') as string
    const city         = formData.get('city')         as string
    const area         = formData.get('area')         as string
    const price        = formData.get('price')        as string

    if (!title || !propertyType || !city || !area || !price) {
      return NextResponse.json(
        { success: false, message: 'title, propertyType, city, area and price are required' },
        { status: 400 }
      )
    }

    // ── Slug ──
    const slug = (formData.get('slug') as string) ||
      title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check slug duplicate
    const slugExists = await Property.findOne({ slug })
    if (slugExists) {
      return NextResponse.json(
        { success: false, message: 'A property with this slug already exists' },
        { status: 409 }
      )
    }

    // ── Parse optional fields ──
    const address      = formData.get('address')      as string || ''
    const lat          = parseFloat(formData.get('lat') as string || '0')
    const lng          = parseFloat(formData.get('lng') as string || '0')
    const bedrooms     = parseInt(formData.get('bedrooms')  as string || '0')
    const bathrooms    = parseInt(formData.get('bathrooms') as string || '0')
    const marla        = parseFloat(formData.get('marla')   as string || '0')
    const kanal        = parseFloat(formData.get('kanal')   as string || '0')
    const description  = formData.get('description')  as string || ''
    const youtubeUrl   = formData.get('youtubeUrl')   as string || ''
    const contactNumber  = formData.get('contactNumber')  as string || ''
    const whatsappNumber = formData.get('whatsappNumber') as string || ''
    const metaTitle      = formData.get('metaTitle')      as string || title
    const metaDescription = formData.get('metaDescription') as string || ''

    // Parse JSON fields
    const features     = JSON.parse(formData.get('features')     as string || '[]')
    const nearbyPlaces = JSON.parse(formData.get('nearbyPlaces') as string || '{}')

    // ── Save images to /public/uploads/ ──
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const saveFile = async (file: File): Promise<string> => {
      const bytes    = await file.arrayBuffer()
      const buffer   = Buffer.from(bytes)
      const ext      = file.name.split('.').pop() || 'jpg'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      await writeFile(path.join(uploadDir, filename), buffer)
      return `/uploads/${filename}`
    }

    // Main photo
    let mainPhotoUrl = ''
    const mainPhotoFile = formData.get('mainPhoto') as File | null
    if (mainPhotoFile && mainPhotoFile.size > 0) {
      mainPhotoUrl = await saveFile(mainPhotoFile)
    }

    // Additional photos
    const additionalPhotoUrls: string[] = []
    const additionalFiles = formData.getAll('additionalPhotos') as File[]
    for (const file of additionalFiles) {
      if (file && file.size > 0) {
        additionalPhotoUrls.push(await saveFile(file))
      }
    }

    // ── Create property ──
    const property = await Property.create({
      title,
      slug,
      propertyType,
      city,
      area,
      address,
      lat,
      lng,
      bedrooms,
      bathrooms,
      marla,
      kanal,
      price:            parseFloat(price),
      mainPhoto:        mainPhotoUrl,
      additionalPhotos: additionalPhotoUrls,
      description,
      youtubeUrl,
      features,
      nearbyPlaces: {
        schools:     nearbyPlaces.Schools     || [],
        hospitals:   nearbyPlaces.Hospitals   || [],
        restaurants: nearbyPlaces.Restaurants || [],
        shopping:    nearbyPlaces.Shopping    || [],
      },
      contactNumber,
      whatsappNumber,
      seo: { metaTitle, metaDescription },
      status: 'active',
    })

    // Populate for response
    const populated = await property.populate([
      { path: 'city',         select: 'name slug' },
      { path: 'area',         select: 'name slug' },
      { path: 'propertyType', select: 'name slug' },
    ])

    return NextResponse.json(
      { success: true, data: populated, message: 'Property published successfully!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/properties error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create property' },
      { status: 500 }
    )
  }
}