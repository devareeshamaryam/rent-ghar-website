 import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Property from '@/models/Property'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

type Params = { params: Promise<{ id: string }> }

// ─── GET /api/properties/[id] ─────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    const property = await Property
      .findById(id)
      .populate('city',         'name slug')
      .populate('area',         'name slug')
      .populate('propertyType', 'name slug')

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'Property not found' },
        { status: 404 }
      )
    }

    // Increment views
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } })

    return NextResponse.json({ success: true, data: property })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// ─── PUT /api/properties/[id] ─────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    const existing = await Property.findById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Property not found' },
        { status: 404 }
      )
    }

    const formData = await req.formData()

    // Helper to get string or fall back to existing value
    const str = (key: string, fallback: unknown) =>
      (formData.get(key) as string) || fallback

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

    // New main photo (optional)
    let mainPhotoUrl = existing.mainPhoto
    const mainPhotoFile = formData.get('mainPhoto') as File | null
    if (mainPhotoFile && mainPhotoFile.size > 0) {
      // Delete old file
      if (existing.mainPhoto) {
        try {
          await unlink(path.join(process.cwd(), 'public', existing.mainPhoto))
        } catch { /* file may not exist */ }
      }
      mainPhotoUrl = await saveFile(mainPhotoFile)
    }

    // Parse JSON fields
    const featuresRaw     = formData.get('features')     as string
    const nearbyRaw       = formData.get('nearbyPlaces') as string
    const features        = featuresRaw ? JSON.parse(featuresRaw)     : existing.features
    const nearbyParsed    = nearbyRaw   ? JSON.parse(nearbyRaw)       : null

    const metaTitle       = str('metaTitle',       existing.seo?.metaTitle)
    const metaDescription = str('metaDescription', existing.seo?.metaDescription)

    const updated = await Property.findByIdAndUpdate(
      id,
      {
        title:        str('title',        existing.title),
        slug:         str('slug',         existing.slug),
        propertyType: str('propertyType', existing.propertyType),
        city:         str('city',         existing.city),
        area:         str('area',         existing.area),
        address:      str('address',      existing.address),
        lat:          parseFloat((formData.get('lat') as string) || String(existing.lat)),
        lng:          parseFloat((formData.get('lng') as string) || String(existing.lng)),
        bedrooms:     parseInt((formData.get('bedrooms')  as string) || String(existing.bedrooms)),
        bathrooms:    parseInt((formData.get('bathrooms') as string) || String(existing.bathrooms)),
        marla:        parseFloat((formData.get('marla')   as string) || String(existing.marla)),
        kanal:        parseFloat((formData.get('kanal')   as string) || String(existing.kanal)),
        price:        parseFloat((formData.get('price')   as string) || String(existing.price)),
        mainPhoto:    mainPhotoUrl,
        description:  str('description',  existing.description),
        youtubeUrl:   str('youtubeUrl',   existing.youtubeUrl),
        features,
        nearbyPlaces: nearbyParsed ? {
          schools:     nearbyParsed.Schools     || [],
          hospitals:   nearbyParsed.Hospitals   || [],
          restaurants: nearbyParsed.Restaurants || [],
          shopping:    nearbyParsed.Shopping    || [],
        } : existing.nearbyPlaces,
        contactNumber:  str('contactNumber',  existing.contactNumber),
        whatsappNumber: str('whatsappNumber', existing.whatsappNumber),
        status:         str('status',         existing.status),
        featured:       formData.get('featured') === 'true',
        seo: { metaTitle, metaDescription },
      },
      { new: true }
    )
    .populate('city',         'name slug')
    .populate('area',         'name slug')
    .populate('propertyType', 'name slug')

    return NextResponse.json({
      success: true,
      data:    updated,
      message: 'Property updated successfully!',
    })
  } catch (error) {
    console.error('PUT /api/properties/[id] error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// ─── DELETE /api/properties/[id] ─────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { id } = await params

    const property = await Property.findById(id)
    if (!property) {
      return NextResponse.json(
        { success: false, message: 'Property not found' },
        { status: 404 }
      )
    }

    const filesToDelete = [property.mainPhoto, ...property.additionalPhotos].filter(Boolean)
    for (const filePath of filesToDelete) {
      try {
        await unlink(path.join(process.cwd(), 'public', filePath))
      } catch { /* ignore missing files */ }
    }

    await Property.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete property' },
      { status: 500 }
    )
  }
}