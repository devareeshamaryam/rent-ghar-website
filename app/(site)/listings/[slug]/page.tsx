 import { notFound } from "next/navigation"
import Propertydetailpage from "@/app/components/Propertydetailpage"

interface Props {
  params: Promise<{ slug: string }>
}

const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

async function getProperty(slug: string) {
  try {
    // pehle slug se try karo, agar nahi mila toh _id se
    let res = await fetch(`${base}/api/properties?slug=${slug}`, { cache: "no-store" })
    let json = await res.json()
    let property = (json.data || []).find((p: any) => p.slug === slug)

    // fallback: agar slug se nahi mila toh _id se try karo
    if (!property) {
      res = await fetch(`${base}/api/properties/${slug}`, { cache: "no-store" })
      json = await res.json()
      property = json.success ? json.data : null
    }

    return property || null
  } catch {
    return null
  }
}

async function checkIsFeatured(propertyId: string): Promise<boolean> {
  try {
    const res  = await fetch(`${base}/api/featured`, { cache: "no-store" })
    const json = await res.json()
    if (!json.success) return false
    return json.data.some((f: any) =>
      f.property?._id === propertyId || f.property === propertyId
    )
  } catch {
    return false
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const p = await getProperty(slug)
  if (!p) return { title: "Property Not Found — RentGhars" }
  return {
    title:       p.seo?.metaTitle       || `${p.title} — RentGhars`,
    description: p.seo?.metaDescription || p.address || "",
    openGraph: {
      title:       p.seo?.metaTitle || p.title,
      description: p.seo?.metaDescription || "",
      images:      p.mainPhoto ? [p.mainPhoto] : [],
    },
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug }   = await params
  const property   = await getProperty(slug)
  if (!property) notFound()

  const isFeatured = await checkIsFeatured(property._id)

  return <Propertydetailpage property={property} isFeatured={isFeatured} />
}