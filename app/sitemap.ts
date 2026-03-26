// app/sitemap.ts
// ─────────────────────────────────────────────────────────────
// Dynamic sitemap — includes cities, areas, and properties.
// Next.js automatically serves this at /sitemap.xml
// ─────────────────────────────────────────────────────────────

import { MetadataRoute } from 'next'
import connectDB from '@/lib/mongoose'
import City from '@/models/City'
import Area from '@/models/Area'
import Property from '@/models/Property'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://rentghars.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB()

    const [cities, areas, properties] = await Promise.all([
      City.find({ isActive: true }).select('slug updatedAt').lean(),
      Area.find({ isActive: true }).select('slug updatedAt').populate('city', 'slug').lean(),
      Property.find({ status: 'active' }).select('_id updatedAt').lean(),
    ])

    // ── Static pages ──
    const staticRoutes: MetadataRoute.Sitemap = [
      { url: BASE_URL,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
      { url: `${BASE_URL}/listings`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    ]

    // ── City listing pages ──
    const cityRoutes: MetadataRoute.Sitemap = (cities as { slug: string; updatedAt: Date }[]).flatMap(c => [
      {
        url:             `${BASE_URL}/listings?city=${c.slug}&purpose=rent`,
        lastModified:    c.updatedAt,
        changeFrequency: 'daily' as const,
        priority:        0.8,
      },
      {
        url:             `${BASE_URL}/listings?city=${c.slug}&purpose=buy`,
        lastModified:    c.updatedAt,
        changeFrequency: 'daily' as const,
        priority:        0.8,
      },
    ])

    // ── Area listing pages ──
    const areaRoutes: MetadataRoute.Sitemap = (areas as { slug: string; updatedAt: Date; city: { slug: string } }[])
      .filter(a => a.city?.slug)
      .flatMap(a => [
        {
          url:             `${BASE_URL}/listings?city=${a.city.slug}&area=${a.slug}&purpose=rent`,
          lastModified:    a.updatedAt,
          changeFrequency: 'daily' as const,
          priority:        0.7,
        },
        {
          url:             `${BASE_URL}/listings?city=${a.city.slug}&area=${a.slug}&purpose=buy`,
          lastModified:    a.updatedAt,
          changeFrequency: 'daily' as const,
          priority:        0.7,
        },
      ])

    // ── Individual property pages ──
    const propertyRoutes: MetadataRoute.Sitemap = (properties as { _id: string; updatedAt: Date }[]).map(p => ({
      url:             `${BASE_URL}/listings/${p._id}`,
      lastModified:    p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority:        0.6,
    }))

    return [...staticRoutes, ...cityRoutes, ...areaRoutes, ...propertyRoutes]
  } catch (err) {
    console.error('Sitemap generation error:', err)
    return [{ url: BASE_URL, lastModified: new Date() }]
  }
}