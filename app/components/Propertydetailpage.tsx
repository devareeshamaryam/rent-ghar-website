 "use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

interface NearbyItem   { name: string; time: string }
interface PopulatedRef { _id: string; name: string; slug: string }

export interface Property {
  _id:             string
  propertyId:      string
  title:           string
  slug:            string
  purpose:         string
  propertyType:    PopulatedRef
  city:            PopulatedRef
  area:            PopulatedRef
  address:         string
  lat:             number
  lng:             number
  bedrooms:        number
  bathrooms:       number
  marla:           number
  kanal:           number
  price:           number
  mainPhoto:       string
  additionalPhotos: string[]
  youtubeUrl:      string
  description:     string
  features:        string[]
  nearbyPlaces: {
    schools:     NearbyItem[]
    hospitals:   NearbyItem[]
    restaurants: NearbyItem[]
    shopping:    NearbyItem[]
  }
  contactNumber:   string
  whatsappNumber:  string
  seo:             { metaTitle: string; metaDescription: string }
  views:           number
  createdAt:       string
}

const FEATURE_MAP: Record<string, { label: string; icon: JSX.Element }> = {
  tv_lounge:       { label: "TV Lounge",       icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  kitchen:         { label: "Kitchen",          icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> },
  electricity:     { label: "Electricity",      icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  water_supply:    { label: "Water Supply",     icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg> },
  gas:             { label: "Gas",              icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg> },
  security:        { label: "Security",         icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  parking:         { label: "Parking",          icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg> },
  internet:        { label: "Internet",         icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  generator:       { label: "Generator",        icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
  lift:            { label: "Lift / Elevator",  icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 10l3-3 3 3M9 14l3 3 3-3"/></svg> },
  swimming_pool:   { label: "Swimming Pool",    icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12h20M2 18c1.5-2 3-2 4.5 0S9 20 10.5 18s3-2 4.5 0S18 20 19.5 18 22 16 22 16"/><path d="M7 12V6a3 3 0 013-3h0a3 3 0 013 3v1"/><line x1="16" y1="9" x2="20" y2="5"/></svg> },
  gym:             { label: "Gym",              icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6.5 6.5h11M6.5 17.5h11M3 10h18M3 14h18M2 10v4M22 10v4"/></svg> },
  store_room:      { label: "Store Room",       icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/></svg> },
  servant_quarter: { label: "Servant Quarter",  icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  drawing_room:    { label: "Drawing Room",     icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="1"/><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"/><line x1="3" y1="14" x2="21" y2="14"/></svg> },
  dining_room:     { label: "Dining Room",      icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg> },
  lawn:            { label: "Lawn / Garden",    icon: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22V12M12 12C12 7 7 3 2 3c0 5 4 9 10 9zM12 12c0-5 5-9 10-9-1 5-5 9-10 9"/></svg> },
}

const NEARBY_TABS = [
  { label: "Schools",     key: "schools"     as const },
  { label: "Hospitals",   key: "hospitals"   as const },
  { label: "Restaurants", key: "restaurants" as const },
  { label: "Shopping",    key: "shopping"    as const },
]

const TABS = ["Overview", "Description", "Features & Amenities", "Location"]

function formatPrice(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000)   return `${(n / 100000).toFixed(1)} Lac`
  return n.toLocaleString()
}

function formatSize(marla: number, kanal: number) {
  if (kanal > 0) return `${kanal} Kanal`
  if (marla > 0) return `${marla} Marla`
  return "—"
}

function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex)
  const thumbsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCurrent(i => (i + 1) % images.length)
      if (e.key === "ArrowLeft")  setCurrent(i => (i === 0 ? images.length - 1 : i - 1))
      if (e.key === "Escape")     onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [images.length, onClose])

  useEffect(() => {
    if (!thumbsRef.current) return
    const activeThumb = thumbsRef.current.children[current] as HTMLElement
    activeThumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }, [current])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col" onClick={onClose}>
      <div className="flex items-center justify-between px-5 py-3 shrink-0" onClick={e => e.stopPropagation()}>
        <span className="text-white text-sm font-bold opacity-70">{current + 1} / {images.length}</span>
        <button onClick={onClose} className="text-white hover:text-[#f0c040] transition-colors p-1">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center relative px-14 min-h-0" onClick={e => e.stopPropagation()}>
        <button onClick={() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="relative w-full h-full">
          <Image src={images[current]} alt={`Photo ${current + 1}`} fill className="object-contain" unoptimized priority />
        </div>
        <button onClick={() => setCurrent(i => (i + 1) % images.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div className="shrink-0 py-3 px-4" onClick={e => e.stopPropagation()}>
        <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-1 justify-center" style={{ scrollbarWidth: "none" }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`relative shrink-0 w-16 h-11 rounded-md overflow-hidden border-2 transition-all duration-200
                ${i === current ? "border-[#f0c040] opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-80"}`}>
              <Image src={img} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ✅ isFeatured prop add hua ────────────────────────────────
export default function Propertydetailpage({
  property: p,
  isFeatured = false,   // ✅ NEW
}: {
  property:    Property
  isFeatured?: boolean  // ✅ NEW
}) {
  const [activeTab, setActiveTab] = useState("Overview")
  const [mainImg,   setMainImg]   = useState(0)
  const [nearbyTab, setNearbyTab] = useState<"schools" | "hospitals" | "restaurants" | "shopping">("schools")
  const [saved,     setSaved]     = useState(false)
  const [lightboxOpen,  setLightboxOpen]  = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const mobileCtaBtnsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!mobileCtaBtnsRef.current) return
      const rect = mobileCtaBtnsRef.current.getBoundingClientRect()
      setShowStickyBar(rect.bottom < 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openLightbox = (index: number) => { setLightboxIndex(index); setLightboxOpen(true) }

  const overviewRef = useRef<HTMLDivElement>(null)
  const descRef     = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  const sectionRefs = [
    { tab: "Overview",             ref: overviewRef  },
    { tab: "Description",          ref: descRef      },
    { tab: "Features & Amenities", ref: featuresRef  },
    { tab: "Location",             ref: locationRef  },
  ]

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sectionRefs.forEach(({ tab, ref }) => {
      if (!ref.current) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(tab) },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      )
      obs.observe(ref.current)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (tab: string) => {
    setActiveTab(tab)
    sectionRefs.find(s => s.tab === tab)?.ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const allImages = [p.mainPhoto, ...p.additionalPhotos].filter(Boolean)
  if (allImages.length === 0) allImages.push("/placeholder.jpg")

  const wa = p.whatsappNumber || p.contactNumber

  // ── ✅ Featured Badge component (reuse karte hain dono jagah) ──
  const FeaturedBadge = () => (
    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#f0c040] text-[#1a2332] px-2.5 py-1 rounded-lg">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Featured
    </span>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        .dp-font { font-family: 'Nunito', sans-serif; }
        .tab-ul { position: relative; }
        .tab-ul.active::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2.5px; background: #f0c040; border-radius: 2px;
        }
        .thumb-btn:hover img { transform: scale(1.06); }
        .lb-thumbs::-webkit-scrollbar { display: none; }

        /* ✅ Featured ribbon animation */
        @keyframes featured-shine {
          0%   { opacity: 0.85; }
          50%  { opacity: 1; }
          100% { opacity: 0.85; }
        }
        .featured-ribbon { animation: featured-shine 2.5s ease-in-out infinite; }
      `}</style>

      {lightboxOpen && (
        <Lightbox images={allImages} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}

      {/* Mobile Sticky Footer */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#e4edf8] px-4 py-3 flex gap-3 transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <a href={`tel:${p.contactNumber}`}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#1a2332] text-[#1a2332] font-extrabold text-sm h-12 rounded-xl transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.14 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.574 2.81.7A2 2 0 0122 16z"/></svg>
          Call
        </a>
        <a href={`https://wa.me/${wa?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold text-sm h-12 rounded-xl transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
      </div>

      <main className="dp-font bg-[#e8f0fb] min-h-screen pb-16 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#1a2332] mb-4 flex-wrap">
            <Link href="/" className="hover:text-[#f0c040] font-semibold">Home</Link>
            <span className="opacity-40">/</span>
            <Link href="/listings" className="hover:text-[#f0c040] font-semibold">Listings</Link>
            <span className="opacity-40">/</span>
            <span className="font-semibold truncate max-w-[200px] sm:max-w-none">{p.title}</span>
          </div>

          {/* ══════════════════════════════════════
              MOBILE TITLE ROW
          ══════════════════════════════════════ */}
          <div className="lg:hidden mb-3">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex gap-2 flex-wrap items-center">
                <span className="bg-[#1a2332] text-white text-[11px] font-extrabold px-3 py-1 rounded-lg">{p.purpose}</span>
                <span className="bg-[#f0c040] text-[#1a2332] text-[11px] font-extrabold px-3 py-1 rounded-lg">{p.propertyType?.name}</span>
                {/* ✅ Featured badge — mobile badges row */}
                {isFeatured && <FeaturedBadge />}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setSaved(s => !s)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors
                    ${saved ? "border-[#f0c040] bg-[#fffbea] text-[#c89000]" : "border-[#e4edf8] bg-white text-[#1a2332] hover:border-[#f0c040]"}`}>
                  <svg width="13" height="13" fill={saved ? "#f0c040" : "none"} stroke={saved ? "#f0c040" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {saved ? "Saved" : "Save"}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 border-[#e4edf8] bg-white text-[#1a2332] hover:border-[#1a2332] transition-colors">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>
            <h1 className="text-xl font-extrabold text-[#1a2332] leading-snug">{p.title}</h1>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#1a4a8a] font-semibold">
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              {p.area?.name}, {p.city?.name}
            </div>
          </div>

          {/* ══════════════════════════════════════
              DESKTOP TITLE ROW
          ══════════════════════════════════════ */}
          <div className="hidden lg:flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 mb-2 flex-wrap items-center">
                <span className="bg-[#1a2332] text-white text-[11px] font-extrabold px-3 py-1 rounded-lg">{p.purpose}</span>
                <span className="bg-[#f0c040] text-[#1a2332] text-[11px] font-extrabold px-3 py-1 rounded-lg">{p.propertyType?.name}</span>
                {/* ✅ Featured badge — desktop badges row */}
                {isFeatured && <FeaturedBadge />}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a2332] leading-snug">{p.title}</h1>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-[#1a4a8a] font-semibold">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {p.area?.name}, {p.city?.name}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setSaved(s => !s)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 transition-colors
                  ${saved ? "border-[#f0c040] bg-[#fffbea] text-[#c89000]" : "border-[#e4edf8] bg-white text-[#1a2332] hover:border-[#f0c040]"}`}>
                <svg width="13" height="13" fill={saved ? "#f0c040" : "none"} stroke={saved ? "#f0c040" : "currentColor"} strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                {saved ? "Saved" : "Save"}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border-2 border-[#e4edf8] bg-white text-[#1a2332] hover:border-[#1a2332] transition-colors">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 min-w-0">

              {/* Desktop Price + Stats */}
              <div className="hidden lg:block bg-white border border-[#e4edf8] rounded-2xl p-4 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-[#1a2332] font-semibold uppercase tracking-wide mb-0.5">Monthly Rent</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#1a2332]">PKR {formatPrice(p.price)}</p>
                  </div>
                  <div className="flex gap-5 sm:gap-8">
                    {p.bedrooms > 0 && (
                      <div className="text-center">
                        <div className="mx-auto mb-1 flex justify-center">
                          <svg width="20" height="20" fill="none" stroke="#1a2332" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8M2 12V7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v2"/></svg>
                        </div>
                        <p className="text-sm font-extrabold text-[#1a2332]">{p.bedrooms}</p>
                        <p className="text-[10px] font-semibold text-[#1a2332]">Beds</p>
                      </div>
                    )}
                    {p.bathrooms > 0 && (
                      <div className="text-center">
                        <div className="mx-auto mb-1 flex justify-center">
                          <svg width="20" height="20" fill="none" stroke="#1a2332" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h4v8M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/></svg>
                        </div>
                        <p className="text-sm font-extrabold text-[#1a2332]">{p.bathrooms}</p>
                        <p className="text-[10px] font-semibold text-[#1a2332]">Baths</p>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="mx-auto mb-1 flex justify-center">
                        <svg width="20" height="20" fill="none" stroke="#1a2332" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                      </div>
                      <p className="text-sm font-extrabold text-[#1a2332]">{formatSize(p.marla, p.kanal)}</p>
                      <p className="text-[10px] font-semibold text-[#1a2332]">Area</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-white border border-[#e4edf8] rounded-2xl overflow-hidden mb-0 lg:mb-4">
                <div
                  className="relative h-56 sm:h-72 lg:h-96 overflow-hidden cursor-zoom-in group"
                  onClick={() => openLightbox(mainImg)}
                >
                  <Image
                    src={allImages[mainImg]}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    unoptimized
                  />

                  {/* ✅ Featured ribbon on image — top left */}
                  {isFeatured && (
                    <div
                      className="featured-ribbon absolute top-3 left-0 z-20 pointer-events-none"
                      style={{
                        background:   'linear-gradient(135deg, #1a2332, #2c3e5a)',
                        color:        '#f0c040',
                        fontSize:     '9px',
                        fontWeight:   900,
                        letterSpacing:'0.12em',
                        padding:      '5px 18px 5px 10px',
                        textTransform:'uppercase',
                        clipPath:     'polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)',
                        boxShadow:    '2px 2px 10px rgba(0,0,0,0.3)',
                      }}
                    >
                      ⭐ Featured
                    </div>
                  )}

                  {/* Zoom hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-full p-2.5">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
                      </svg>
                    </div>
                  </div>

                  {/* Mobile price overlay */}
                  <div className="lg:hidden absolute bottom-8 left-0 z-10" onClick={e => e.stopPropagation()}>
                    <div className="bg-black/55 rounded-r-xl px-4 py-2.5">
                      <p className="text-base font-extrabold text-white leading-none">Rs. {formatPrice(p.price)}</p>
                    </div>
                  </div>

                  {/* Arrows */}
                  {allImages.length > 1 && <>
                    <button onClick={e => { e.stopPropagation(); setMainImg(i => (i === 0 ? allImages.length - 1 : i - 1)) }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#1a2332]/80 hover:bg-[#1a2332] text-white rounded-full w-9 h-9 flex items-center justify-center z-10 transition-colors">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button onClick={e => { e.stopPropagation(); setMainImg(i => (i === allImages.length - 1 ? 0 : i + 1)) }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1a2332]/80 hover:bg-[#1a2332] text-white rounded-full w-9 h-9 flex items-center justify-center z-10 transition-colors">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </>}

                  <div className="absolute bottom-3 right-3 bg-[#1a2332]/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg z-10">
                    {mainImg + 1} / {allImages.length}
                  </div>
                </div>

                {allImages.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {allImages.map((img, i) => (
                      <button key={i} onClick={() => setMainImg(i)}
                        className={`thumb-btn relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === mainImg ? "border-[#1a2332]" : "border-transparent hover:border-[#1a2332]/40"}`}>
                        <Image src={img} alt="" fill className="object-cover transition-transform duration-300" unoptimized />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Stats */}
              <div className="lg:hidden bg-white border border-[#e4edf8] rounded-2xl px-4 py-3 mb-3 mt-3">
                <div className="flex items-center justify-around gap-2">
                  {p.bedrooms > 0 && (
                    <div className="text-center">
                      <div className="mx-auto mb-1 flex justify-center">
                        <svg width="18" height="18" fill="none" stroke="#1a2332" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8M2 12V7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v2"/></svg>
                      </div>
                      <p className="text-sm font-extrabold text-[#1a2332]">{p.bedrooms}</p>
                      <p className="text-[10px] font-semibold text-[#1a2332]">Beds</p>
                    </div>
                  )}
                  {p.bedrooms > 0 && p.bathrooms > 0 && <div className="w-px h-8 bg-[#e4edf8]" />}
                  {p.bathrooms > 0 && (
                    <div className="text-center">
                      <div className="mx-auto mb-1 flex justify-center">
                        <svg width="18" height="18" fill="none" stroke="#1a2332" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h4v8M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/></svg>
                      </div>
                      <p className="text-sm font-extrabold text-[#1a2332]">{p.bathrooms}</p>
                      <p className="text-[10px] font-semibold text-[#1a2332]">Baths</p>
                    </div>
                  )}
                  {p.bathrooms > 0 && <div className="w-px h-8 bg-[#e4edf8]" />}
                  <div className="text-center">
                    <div className="mx-auto mb-1 flex justify-center">
                      <svg width="18" height="18" fill="none" stroke="#1a2332" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    </div>
                    <p className="text-sm font-extrabold text-[#1a2332]">{formatSize(p.marla, p.kanal)}</p>
                    <p className="text-[10px] font-semibold text-[#1a2332]">Area</p>
                  </div>
                </div>
              </div>

              {/* Mobile CTA buttons */}
              <div ref={mobileCtaBtnsRef} className="lg:hidden flex gap-3 mb-4">
                <a href={`tel:${p.contactNumber}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-[#1a2332] text-[#1a2332] font-extrabold text-sm h-12 rounded-xl transition-colors hover:bg-[#1a2332] hover:text-[#f0c040]">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.14 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.574 2.81.7A2 2 0 0122 16z"/></svg>
                  Call Now
                </a>
                <a href={`https://wa.me/${wa?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold text-sm h-12 rounded-xl transition-colors hover:bg-[#1da851]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>

              {/* Sticky Tabs */}
              <div className="bg-white border border-[#e4edf8] rounded-2xl overflow-hidden mb-4 sticky top-16 z-20">
                <div className="flex border-b border-[#e4edf8] px-3 overflow-x-auto">
                  {TABS.map(tab => (
                    <button key={tab} onClick={() => scrollTo(tab)}
                      className={`tab-ul shrink-0 text-xs sm:text-sm font-bold py-3.5 px-2.5 sm:px-4 transition-colors mr-0.5
                        ${activeTab === tab ? "active text-[#1a2332]" : "text-[#1a2332]/40 hover:text-[#1a2332]"}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">

                {/* OVERVIEW */}
                <div ref={overviewRef} className="bg-white border border-[#e4edf8] rounded-2xl p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold text-[#1a2332] mb-3">Overview</h3>
                  <div className="border border-[#d0e2f8] rounded-xl overflow-hidden text-xs">
                    {[
                      ["Property ID", p.propertyId],
                      ["Type",        p.propertyType?.name],
                      ["Purpose",     p.purpose],
                      ["City",        p.city?.name],
                      ["Area",        p.area?.name],
                      ["Bedrooms",    String(p.bedrooms)],
                      ["Bathrooms",   String(p.bathrooms)],
                      ["Size",        formatSize(p.marla, p.kanal)],
                      ["Added",       new Date(p.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })],
                    ].map(([k, v], i) => (
                      <div key={k} className={`flex justify-between px-3.5 py-2.5 border-b border-[#d0e2f8] last:border-0 ${i % 2 === 0 ? "bg-[#eef4ff]" : "bg-white"}`}>
                        <span className="text-[#1a2332] font-semibold">{k}</span>
                        <span className="text-[#1a2332] font-bold text-right">{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div ref={descRef} className="bg-white border border-[#e4edf8] rounded-2xl p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold text-[#1a2332] mb-3">Description</h3>
                  {p.description ? (
                    <div className="text-sm text-[#1a2332] leading-relaxed tiptap" dangerouslySetInnerHTML={{ __html: p.description }} />
                  ) : (
                    <p className="text-sm text-gray-400">No description provided.</p>
                  )}
                </div>

                {/* FEATURES */}
                <div ref={featuresRef} className="bg-white border border-[#e4edf8] rounded-2xl p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold text-[#1a2332] mb-3">Features & Amenities</h3>
                  {p.features?.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                      {p.features.map(key => {
                        const f = FEATURE_MAP[key]
                        if (!f) return null
                        return (
                          <div key={key} className="flex flex-col items-center gap-2 bg-[#f8faff] border border-[#e4edf8] rounded-xl py-4 px-2 hover:bg-[#fffbea] hover:border-[#f0c040] transition-all cursor-default text-[#1a2332]">
                            {f.icon}
                            <span className="text-[10px] font-bold text-center leading-tight">{f.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No features listed.</p>
                  )}
                </div>

                {/* LOCATION */}
                <div ref={locationRef} className="bg-white border border-[#e4edf8] rounded-2xl p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold text-[#1a2332] mb-3">Location</h3>
                  <div className="bg-[#dce8f8] border border-[#c0d4f0] rounded-xl h-40 flex flex-col items-center justify-center mb-4">
                    <svg width="36" height="36" fill="none" stroke="#1a4a8a" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-2 opacity-60">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    <p className="text-sm font-extrabold text-[#1a2332]">{p.area?.name}, {p.city?.name}</p>
                    <p className="text-xs text-[#1a2332]/60 mt-0.5">{p.address}</p>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#1a2332] mb-3">Nearby Places</h3>
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {NEARBY_TABS.map(n => (
                      <button key={n.key} onClick={() => setNearbyTab(n.key)}
                        className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors
                          ${nearbyTab === n.key ? "bg-[#1a2332] text-white border-[#1a2332]" : "bg-white text-[#1a2332] border-[#dce8f8] hover:border-[#1a2332]"}`}>
                        {n.label}
                        {(p.nearbyPlaces?.[n.key]?.length ?? 0) > 0 && (
                          <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${nearbyTab === n.key ? "bg-white text-[#1a2332]" : "bg-[#1a2332] text-white"}`}>
                            {p.nearbyPlaces[n.key].length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {(p.nearbyPlaces?.[nearbyTab]?.length ?? 0) > 0 ? (
                      p.nearbyPlaces[nearbyTab].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 bg-white border border-[#e4edf8] rounded-xl px-3.5 py-2.5">
                          <span className="w-5 h-5 bg-[#eef4ff] rounded-full flex items-center justify-center text-[10px] font-extrabold text-[#1a4a8a] shrink-0">{i + 1}</span>
                          <span className="text-sm text-[#1a2332] font-semibold">{item.name}</span>
                          {item.time && <span className="ml-auto text-[10px] text-[#1a2332] font-semibold">{item.time}</span>}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-2">No nearby places added.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
              <div className="lg:sticky lg:top-20 space-y-4">
                <div className="bg-white border border-[#e4edf8] rounded-2xl p-4">
                  <h3 className="text-sm font-extrabold text-[#1a2332] mb-3">Contact Agent</h3>
                  <a href={`https://wa.me/${wa?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-extrabold text-sm h-11 rounded-xl transition-colors mb-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Inquiry
                  </a>
                  <a href={`tel:${p.contactNumber}`}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#1a2332] text-[#1a2332] hover:bg-[#1a2332] hover:text-[#f0c040] font-extrabold text-sm h-11 rounded-xl transition-colors mb-2.5">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.14 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.574 2.81.7A2 2 0 0122 16z"/></svg>
                    Call: {p.contactNumber}
                  </a>
                  <button className="w-full flex items-center justify-center gap-2 bg-[#eef4ff] border border-[#dce8f8] text-[#1a2332] hover:bg-[#1a2332] hover:text-white font-bold text-sm h-10 rounded-xl transition-colors">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Send Email
                  </button>
                </div>
                <div className="bg-white border border-[#e4edf8] rounded-2xl p-4">
                  <h3 className="text-sm font-extrabold text-[#1a2332] mb-3">Property Details</h3>
                  <div className="space-y-2">
                    {[
                      ["Property ID", p.propertyId],
                      ["Type",        p.propertyType?.name],
                      ["Purpose",     p.purpose],
                      ["City",        p.city?.name],
                      ["Area",        p.area?.name],
                      ["Size",        formatSize(p.marla, p.kanal)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between text-xs border-b border-[#d0e2f8] pb-2 last:border-0 last:pb-0">
                        <span className="text-[#1a2332] font-semibold">{k}</span>
                        <span className="text-[#1a2332] font-extrabold">{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}