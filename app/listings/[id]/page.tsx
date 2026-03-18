 import { notFound } from "next/navigation"
import Propertydetailpage from "../../components/Propertydetailpage"

interface Props {
  params: Promise<{ id: string }>
}

async function getProperty(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const res = await fetch(`${base}/api/properties/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.success ? json.data : null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const p = await getProperty(id)
  if (!p) return { title: "Property Not Found — RentGhars" }
  return {
    title:       p.seo?.metaTitle       || `${p.title} — RentGhars`,
    description: p.seo?.metaDescription || p.address || "",
    openGraph: {
      title:  p.seo?.metaTitle || p.title,
      description: p.seo?.metaDescription || "",
      images: p.mainPhoto ? [p.mainPhoto] : [],
    },
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) notFound()
  return <Propertydetailpage property={property} />
}