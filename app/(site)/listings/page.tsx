 // app/(site)/listings/page.tsx
// ─────────────────────────────────────────────────────────────
// Server Component — exports generateMetadata for dynamic SEO.
// The actual filter UI lives in ListingsClient (client component).
// ─────────────────────────────────────────────────────────────

import { Metadata } from 'next'
import connectDB from '@/lib/mongoose'
import City from '@/models/City'
import Area from '@/models/Area'
import ListingsClient from './ListingsClient'

// ── Types ─────────────────────────────────────────────────────
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

// ── Helpers ───────────────────────────────────────────────────
function sp(val: string | string[] | undefined): string {
  return Array.isArray(val) ? val[0] : val ?? ''
}

// ── generateMetadata ──────────────────────────────────────────
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const citySlug = sp(searchParams.city)
  const areaSlug = sp(searchParams.area)
  const purpose  = sp(searchParams.purpose) || 'rent'   // 'rent' | 'buy'

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://rentghars.com'

  // ── Default (no filters) ──
  if (!citySlug) {
    return {
      title:       'Properties for Rent & Sale in Pakistan | RentGhars',
      description: 'Find the best rental and sale properties across Pakistan. Browse houses, apartments, flats and more on RentGhars.',
      alternates:  { canonical: `${BASE_URL}/listings` },
      openGraph: {
        title:       'Properties for Rent & Sale in Pakistan | RentGhars',
        description: 'Find the best rental and sale properties across Pakistan.',
        url:         `${BASE_URL}/listings`,
        type:        'website',
      },
    }
  }

  try {
    await connectDB()

    const city = await City.findOne({ slug: citySlug, isActive: true }).lean()

    // ── City + Area ──
    if (areaSlug && city) {
      const area = await Area.findOne({ slug: areaSlug, city: (city as {_id: unknown})._id, isActive: true }).lean() as {
        name: string
        metaTitle: string
        metaDescription: string
        canonicalUrl: string
        rentMetaTitle: string
        rentMetaDescription: string
      } | null

      if (area) {
        const title = purpose === 'rent'
          ? (area.rentMetaTitle || `Properties for Rent in ${area.name}, ${(city as {name: string}).name} | RentGhars`)
          : (area.metaTitle     || `Properties in ${area.name}, ${(city as {name: string}).name} | RentGhars`)

        const desc = purpose === 'rent'
          ? (area.rentMetaDescription || area.metaDescription || `Browse ${purpose} properties in ${area.name}, ${(city as {name: string}).name}.`)
          : (area.metaDescription || `Browse properties in ${area.name}, ${(city as {name: string}).name}.`)

        const canonical = area.canonicalUrl || `${BASE_URL}/listings?city=${citySlug}&area=${areaSlug}&purpose=${purpose}`

        return {
          title,
          description: desc,
          alternates:  { canonical },
          openGraph:   { title, description: desc, url: canonical, type: 'website' },
        }
      }
    }

    // ── City only ──
    if (city) {
      const c = city as {
        name: string
        metaTitle: string
        metaDescription: string
        canonicalUrl: string
        rentMetaTitle: string
        rentMetaDescription: string
        buyMetaTitle: string
        buyMetaDescription: string
        thumbnail: string
      }

      const title = purpose === 'rent'
        ? (c.rentMetaTitle || `Properties for Rent in ${c.name} | RentGhars`)
        : (c.buyMetaTitle  || `Properties for Sale in ${c.name} | RentGhars`)

      const desc = purpose === 'rent'
        ? (c.rentMetaDescription || c.metaDescription || `Browse rental properties in ${c.name}.`)
        : (c.buyMetaDescription  || c.metaDescription || `Browse properties for sale in ${c.name}.`)

      const canonical = c.canonicalUrl || `${BASE_URL}/listings?city=${citySlug}&purpose=${purpose}`

      return {
        title,
        description: desc,
        alternates:  { canonical },
        openGraph: {
          title,
          description: desc,
          url:         canonical,
          type:        'website',
          images:      c.thumbnail ? [{ url: c.thumbnail }] : [],
        },
      }
    }
  } catch (err) {
    console.error('generateMetadata error:', err)
  }

  // Fallback
  return {
    title:       'Property Listings | RentGhars',
    description: 'Browse property listings on RentGhars.',
    alternates:  { canonical: `${BASE_URL}/listings` },
  }
}

// ── Page (Server Component) ───────────────────────────────────
export default function ListingsPage({ searchParams }: PageProps) {
  // Pass URL params down to client component as initial filter values
  return (
    <ListingsClient
      initialCity={sp(searchParams.city)}
      initialArea={sp(searchParams.area)}
      initialPurpose={sp(searchParams.purpose) || 'rent'}
    />
  )
}