 // Path: app/listings/[id]/page.tsx

import { notFound } from "next/navigation";
import Propertydetailpage from "../../components/Propertydetailpage";
import { getListingById } from "../../data/listingsData";

interface Props {
  params: Promise<{ id: string }>;
}

/* ── Metadata ── */
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) return { title: "Not Found" };

  return {
    title: `${listing.title} — RentGhars`,
    description: `${listing.type} for rent in ${listing.location}. PKR ${listing.price}.`,
  };
}

/* ── Page ── */
export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) notFound();

  return <Propertydetailpage property={listing} />;
}