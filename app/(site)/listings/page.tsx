 "use client"

import { useState, useEffect, useCallback } from "react"
import PropertyCard from "@/app/components/Propertycard"

// ─── Types ────────────────────────────────────────────────
interface Property {
  _id:             string
  title:           string
  price:           number
  bedrooms:        number
  bathrooms:       number
  marla:           number
  kanal:           number
  mainPhoto:       string
  additionalPhotos: string[]
  purpose:         string
  propertyType:    { _id: string; name: string }
  city:            { _id: string; name: string }
  area:            { _id: string; name: string }
  contactNumber:   string
  whatsappNumber:  string
  createdAt:       string
}

interface RefItem { _id: string; name: string }

// ─── Helpers ──────────────────────────────────────────────
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

function timeAgo(dateStr: string) {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(hours / 24)
  if (days > 0)  return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  return "Today"
}

const LIMIT = 9

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [cities,     setCities]     = useState<RefItem[]>([])
  const [areas,      setAreas]      = useState<RefItem[]>([])
  const [types,      setTypes]      = useState<RefItem[]>([])
  const [loading,    setLoading]    = useState(true)
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)

  // Filters
  const [cityId,  setCityId]  = useState("")
  const [areaId,  setAreaId]  = useState("")
  const [typeId,  setTypeId]  = useState("")
  const [minP,    setMinP]    = useState("")
  const [maxP,    setMaxP]    = useState("")

  // Load dropdowns once
  useEffect(() => {
    fetch("/api/cities").then(r => r.json()).then(d => setCities(d.data || []))
    fetch("/api/types").then(r => r.json()).then(d => setTypes(d.data || []))
  }, [])

  // Load areas when city changes
  useEffect(() => {
    if (!cityId) { setAreas([]); setAreaId(""); return }
    fetch(`/api/areas?city=${cityId}`)
      .then(r => r.json())
      .then(d => setAreas(d.data || []))
    setAreaId("")
  }, [cityId])

  // Fetch properties
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page: String(page), limit: String(LIMIT), status: "active" })
      if (cityId) q.set("city",     cityId)
      if (areaId) q.set("area",     areaId)
      if (typeId) q.set("type",     typeId)
      if (minP)   q.set("minPrice", minP)
      if (maxP)   q.set("maxPrice", maxP)
      const res  = await fetch(`/api/properties?${q}`)
      const data = await res.json()
      setProperties(data.data || [])
      setTotal(data.pagination?.total || 0)
    } catch {
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [cityId, areaId, typeId, minP, maxP, page])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  const clearAll = () => {
    setCityId(""); setAreaId(""); setTypeId("")
    setMinP(""); setMaxP(""); setPage(1)
  }

  // Active filter chips
  const chips = [
    cityId && { label: cities.find(c => c._id === cityId)?.name || "", clear: () => { setCityId(""); setPage(1) } },
    areaId && { label: areas.find(a => a._id === areaId)?.name  || "", clear: () => { setAreaId(""); setPage(1) } },
    typeId && { label: types.find(t => t._id === typeId)?.name  || "", clear: () => { setTypeId(""); setPage(1) } },
    (minP || maxP) && { label: `PKR ${minP || "0"} – ${maxP || "∞"}`, clear: () => { setMinP(""); setMaxP(""); setPage(1) } },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  const totalPages = Math.ceil(total / LIMIT)

  const sel = "bg-white border border-[#e8d98a] text-[#1a2332] text-xs h-8 rounded-lg outline-none cursor-pointer appearance-none px-2.5 pr-7 hover:border-[#1a2332] focus:border-[#1a2332] transition-colors listing-font"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .listing-font { font-family: 'Nunito', sans-serif; }
        .sel-wrap { position: relative; display: inline-flex; }
        .sel-wrap::after {
          content: ''; position: absolute; right: 9px; top: 50%;
          transform: translateY(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #1a2332;
          pointer-events: none;
        }
      `}</style>

      <main className="listing-font bg-[#f6f9ff] min-h-screen">

        {/* ── Sticky filter bar ── */}
        <div className="border-b border-[#e8d98a] sticky top-0 z-30 shadow-sm" style={{ background: "#fffde8" }}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
            <div className="flex flex-wrap gap-2 items-center">

              <span className="bg-[#1a2332] text-white text-[11px] font-extrabold px-3.5 h-8 rounded-lg flex items-center shrink-0">
                For Rent
              </span>

              {/* City */}
              <div className="sel-wrap">
                <select value={cityId} onChange={e => { setCityId(e.target.value); setPage(1) }} className={sel}>
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              {/* Area */}
              <div className="sel-wrap">
                <select value={areaId} onChange={e => { setAreaId(e.target.value); setPage(1) }} className={sel} disabled={!cityId}>
                  <option value="">{cityId ? "All Areas" : "Select city first"}</option>
                  {areas.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>

              {/* Type */}
              <div className="sel-wrap">
                <select value={typeId} onChange={e => { setTypeId(e.target.value); setPage(1) }} className={sel}>
                  <option value="">All Types</option>
                  {types.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>

              <input type="number" placeholder="Min Price" value={minP}
                onChange={e => setMinP(e.target.value)}
                className="bg-white border border-[#e8d98a] text-[#1a2332] text-xs h-8 px-2.5 rounded-lg outline-none w-[88px] focus:border-[#1a2332] transition-colors listing-font placeholder-[#b0c8e0]" />

              <input type="number" placeholder="Max Price" value={maxP}
                onChange={e => setMaxP(e.target.value)}
                className="bg-white border border-[#e8d98a] text-[#1a2332] text-xs h-8 px-2.5 rounded-lg outline-none w-[88px] focus:border-[#1a2332] transition-colors listing-font placeholder-[#b0c8e0]" />

              <button onClick={() => { setPage(1); fetchProperties() }}
                className="ml-auto flex items-center gap-1.5 bg-[#1a2332] text-white hover:text-[#f0c040] text-xs font-bold h-8 px-4 rounded-lg transition-colors shrink-0">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search
              </button>
            </div>

            {/* Active chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {chips.map(ch => (
                  <span key={ch.label} className="inline-flex items-center gap-1 bg-[#fef9c3] border border-[#e8d98a] text-[#1a2332] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {ch.label}
                    <button onClick={ch.clear} className="text-gray-400 hover:text-[#1a2332]">✕</button>
                  </span>
                ))}
                <button onClick={clearAll} className="text-[10px] text-red-400 hover:text-red-600 font-semibold">Clear all</button>
              </div>
            )}
          </div>
        </div>

        {/* ── Results heading ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#1a2332]">
              Rental Properties
              {cityId && cities.find(c => c._id === cityId) && (
                <span className="text-[#1a4a8a]"> in {cities.find(c => c._id === cityId)?.name}</span>
              )}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">{total} properties available</p>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e8edf5] overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-24">
              <svg className="w-12 h-12 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <p className="text-gray-400 font-semibold text-sm">No properties found</p>
              {chips.length > 0 && (
                <button onClick={clearAll} className="mt-3 text-xs text-[#1a4a8a] underline font-semibold">Clear all filters</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {properties.map(p => (
                <PropertyCard
                  key={p._id}
                  id={p._id}
                  images={[p.mainPhoto, ...p.additionalPhotos].filter(Boolean).length > 0
                    ? [p.mainPhoto, ...p.additionalPhotos].filter(Boolean)
                    : ["/placeholder.jpg"]}
                  price={formatPrice(p.price)}
                  title={p.title}
                  beds={p.bedrooms}
                  baths={p.bathrooms}
                  area={formatSize(p.marla, p.kanal)}
                  location={`${p.area?.name ?? ""}, ${p.city?.name ?? ""}`}
                  type={p.propertyType?.name ?? "Property"}
                  date={timeAgo(p.createdAt)}
                  href={`/listings/${p._id}`}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-5 py-2.5 text-xs font-bold border-2 border-[#1a2332] text-[#1a2332] rounded-xl hover:bg-[#1a2332] hover:text-[#f0c040] disabled:opacity-30 transition-colors">
                ← Prev
              </button>
              <span className="text-xs font-semibold text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-5 py-2.5 text-xs font-bold border-2 border-[#1a2332] text-[#1a2332] rounded-xl hover:bg-[#1a2332] hover:text-[#f0c040] disabled:opacity-30 transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>

      </main>
    </>
  )
}