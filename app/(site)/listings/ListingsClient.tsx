 'use client'

// app/(site)/listings/ListingsClient.tsx
// ─────────────────────────────────────────────────────────────
// Extended filters: bedrooms, bathrooms, marla range + refined colors
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PropertyCard from '@/app/components/Propertycard'

// ─── Types ────────────────────────────────────────────────────
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
  city:            { _id: string; name: string; slug: string }
  area:            { _id: string; name: string; slug: string }
  contactNumber:   string
  whatsappNumber:  string
  createdAt:       string
}

interface RefItem { _id: string; name: string; slug?: string }

// ─── Helpers ──────────────────────────────────────────────────
function formatPrice(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000)   return `${(n / 100000).toFixed(1)} Lac`
  return n.toLocaleString()
}

function formatSize(marla: number, kanal: number) {
  if (kanal > 0) return `${kanal} Kanal`
  if (marla > 0) return `${marla} Marla`
  return '—'
}

function timeAgo(dateStr: string) {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(hours / 24)
  if (days > 0)  return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return 'Today'
}

const LIMIT = 9

interface Props {
  initialCity:    string
  initialArea:    string
  initialPurpose?: string
}

export default function ListingsClient({ initialCity, initialArea }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [properties, setProperties] = useState<Property[]>([])
  const [cities,     setCities]     = useState<RefItem[]>([])
  const [areas,      setAreas]      = useState<RefItem[]>([])
  const [types,      setTypes]      = useState<RefItem[]>([])
  const [loading,    setLoading]    = useState(true)
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [showMore,   setShowMore]   = useState(false)

  // ── Core filters
  const [cityId,    setCityId]    = useState(initialCity)
  const [areaId,    setAreaId]    = useState(initialArea)
  const [typeId,    setTypeId]    = useState('')
  const [minP,      setMinP]      = useState('')
  const [maxP,      setMaxP]      = useState('')

  // ── Extended filters
  const [bedrooms,  setBedrooms]  = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [minMarla,  setMinMarla]  = useState('')
  const [maxMarla,  setMaxMarla]  = useState('')

  // Load dropdowns once
  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.data || []))
    fetch('/api/types').then(r => r.json()).then(d => setTypes(d.data || []))
  }, [])

  // Load areas when city changes
  useEffect(() => {
    if (!cityId) { setAreas([]); setAreaId(''); return }
    fetch(`/api/areas?city=${cityId}`)
      .then(r => r.json())
      .then(d => setAreas(d.data || []))
    setAreaId('')
  }, [cityId])

  // ── Update URL ──────────────────────────────────────────────
  const updateURL = useCallback((cId: string, aId: string) => {
    const cityObj = cities.find(c => c._id === cId)
    const areaObj = areas.find(a  => a._id === aId)

    const params = new URLSearchParams()
    if (cityObj?.slug) params.set('city', cityObj.slug)
    if (areaObj?.slug) params.set('area', areaObj.slug)

    const qs = params.toString()
    router.replace(qs ? `/listings?${qs}` : '/listings', { scroll: false })
  }, [cities, areas, router])

  // ── Fetch properties ────────────────────────────────────────
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page: String(page), limit: String(LIMIT), status: 'active' })
      if (cityId)    q.set('city',      cityId)
      if (areaId)    q.set('area',      areaId)
      if (typeId)    q.set('type',      typeId)
      if (minP)      q.set('minPrice',  minP)
      if (maxP)      q.set('maxPrice',  maxP)
      if (bedrooms)  q.set('bedrooms',  bedrooms)
      if (bathrooms) q.set('bathrooms', bathrooms)
      if (minMarla)  q.set('minMarla',  minMarla)
      if (maxMarla)  q.set('maxMarla',  maxMarla)

      const res  = await fetch(`/api/properties?${q}`)
      const data = await res.json()
      setProperties(data.data || [])
      setTotal(data.pagination?.total || 0)
    } catch {
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [cityId, areaId, typeId, minP, maxP, bedrooms, bathrooms, minMarla, maxMarla, page])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  // Sync URL when filters change
  useEffect(() => {
    if (cities.length > 0) updateURL(cityId, areaId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, areaId, cities])

  const clearAll = () => {
    setCityId(''); setAreaId(''); setTypeId('')
    setMinP(''); setMaxP('')
    setBedrooms(''); setBathrooms('')
    setMinMarla(''); setMaxMarla('')
    setPage(1)
  }

  // Active filter chips
  const chips = [
    cityId     && { label: cities.find(c => c._id === cityId)?.name  || '', clear: () => { setCityId('');   setPage(1) } },
    areaId     && { label: areas.find(a  => a._id === areaId)?.name  || '', clear: () => { setAreaId('');   setPage(1) } },
    typeId     && { label: types.find(t  => t._id === typeId)?.name  || '', clear: () => { setTypeId('');   setPage(1) } },
    bedrooms   && { label: `${bedrooms} Bed`,                               clear: () => { setBedrooms(''); setPage(1) } },
    bathrooms  && { label: `${bathrooms} Bath`,                             clear: () => { setBathrooms('');setPage(1) } },
    (minMarla || maxMarla) && { label: `${minMarla || '0'}–${maxMarla || '∞'} Marla`, clear: () => { setMinMarla(''); setMaxMarla(''); setPage(1) } },
    (minP || maxP) && { label: `PKR ${minP || '0'} – ${maxP || '∞'}`,      clear: () => { setMinP(''); setMaxP(''); setPage(1) } },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  const totalPages = Math.ceil(total / LIMIT)

  // ── Shared select class ─────────────────────────────────────
  const sel = 'bg-white border border-[#c8b87a] text-[#1a2332] text-xs h-9 rounded-lg outline-none cursor-pointer appearance-none px-3 pr-8 hover:border-[#8a6e2f] focus:border-[#8a6e2f] focus:ring-1 focus:ring-[#c8b87a]/40 transition-all listing-font shadow-sm'
  const inp = 'bg-white border border-[#c8b87a] text-[#1a2332] text-xs h-9 px-3 rounded-lg outline-none focus:border-[#8a6e2f] focus:ring-1 focus:ring-[#c8b87a]/40 transition-all listing-font placeholder-[#b0b8c0] shadow-sm'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .listing-font { font-family: 'Nunito', sans-serif; }

        .sel-wrap { position: relative; display: inline-flex; }
        .sel-wrap::after {
          content: ''; position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid #8a6e2f;
          pointer-events: none;
        }

        .filter-bar {
          background: linear-gradient(135deg, #fdf6e3 0%, #fef9ed 50%, #fdf3d0 100%);
          border-bottom: 1.5px solid #d4a853;
        }

        .purpose-btn-active {
          background: linear-gradient(135deg, #1a2332, #2c3e5a);
          color: #f0c040;
          box-shadow: 0 2px 8px rgba(26,35,50,0.25);
        }

        .search-btn {
          background: linear-gradient(135deg, #1a2332, #2c3e5a);
          color: #f0c040;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(26,35,50,0.2);
        }
        .search-btn:hover {
          background: linear-gradient(135deg, #2c3e5a, #1a2332);
          box-shadow: 0 4px 16px rgba(26,35,50,0.3);
          transform: translateY(-1px);
        }

        .more-filters-btn {
          border: 1.5px dashed #c8b87a;
          color: #8a6e2f;
          transition: all 0.2s;
        }
        .more-filters-btn:hover {
          border-color: #8a6e2f;
          background: #fef9e7;
        }

        .chip {
          background: linear-gradient(135deg, #fef3cd, #fde8a0);
          border: 1px solid #d4a853;
          color: #7a5c1e;
        }

        .extended-filters {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }
        .extended-filters.open  { max-height: 120px; opacity: 1; }
        .extended-filters.closed { max-height: 0; opacity: 0; }
      `}</style>

      <main className="listing-font bg-[#f5f7fa] min-h-screen">

        {/* ── Sticky filter bar ── */}
        <div className="filter-bar sticky top-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">

            {/* Row 1: purpose + main filters + search */}
            <div className="flex flex-wrap gap-2 items-center">

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
                  <option value="">{cityId ? 'All Areas' : 'Select city first'}</option>
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

              {/* More Filters toggle */}
              <button
                onClick={() => setShowMore(p => !p)}
                className={`more-filters-btn text-[11px] font-bold h-9 px-3.5 rounded-xl flex items-center gap-1.5 shrink-0 ${showMore ? 'bg-[#fef9e7] border-[#8a6e2f]' : ''}`}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <line x1="4" y1="6"  x2="20" y2="6"/>
                  <line x1="4" y1="12" x2="14" y2="12"/>
                  <line x1="4" y1="18" x2="17" y2="18"/>
                </svg>
                More Filters
                {(bedrooms || bathrooms || minMarla || maxMarla || minP || maxP) && (
                  <span className="w-4 h-4 rounded-full bg-[#d4a853] text-white text-[9px] font-black flex items-center justify-center">
                    {[bedrooms, bathrooms, minMarla || maxMarla, minP || maxP].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Search button */}
              <button onClick={() => { setPage(1); fetchProperties() }}
                className="search-btn ml-auto flex items-center gap-1.5 text-xs font-bold h-9 px-5 rounded-xl shrink-0">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search
              </button>
            </div>

            {/* Row 2: Extended filters (collapsible) */}
            <div className={`extended-filters ${showMore ? 'open' : 'closed'}`}>
              <div className="flex flex-wrap gap-2 items-center pt-2.5">

                {/* Bedrooms */}
                <div className="sel-wrap">
                  <select value={bedrooms} onChange={e => { setBedrooms(e.target.value); setPage(1) }} className={sel}>
                    <option value="">Any Beds</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5 Bedrooms</option>
                    <option value="6">6+ Bedrooms</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div className="sel-wrap">
                  <select value={bathrooms} onChange={e => { setBathrooms(e.target.value); setPage(1) }} className={sel}>
                    <option value="">Any Baths</option>
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4 Bathrooms</option>
                    <option value="5">5+ Bathrooms</option>
                  </select>
                </div>

                {/* Marla range */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="Min Marla"
                    value={minMarla}
                    onChange={e => setMinMarla(e.target.value)}
                    className={`${inp} w-[96px]`}
                  />
                  <span className="text-[#b0a080] text-xs font-semibold">–</span>
                  <input
                    type="number"
                    placeholder="Max Marla"
                    value={maxMarla}
                    onChange={e => setMaxMarla(e.target.value)}
                    className={`${inp} w-[96px]`}
                  />
                </div>

                {/* Price range */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minP}
                    onChange={e => setMinP(e.target.value)}
                    className={`${inp} w-[96px]`}
                  />
                  <span className="text-[#b0a080] text-xs font-semibold">–</span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxP}
                    onChange={e => setMaxP(e.target.value)}
                    className={`${inp} w-[96px]`}
                  />
                </div>

              </div>
            </div>

            {/* Active chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {chips.map(ch => (
                  <span key={ch.label} className="chip inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {ch.label}
                    <button onClick={ch.clear} className="text-[#b08040] hover:text-[#7a5c1e] ml-0.5">✕</button>
                  </span>
                ))}
                <button onClick={clearAll} className="text-[10px] text-red-400 hover:text-red-600 font-bold ml-1">
                  Clear all
                </button>
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
              {areaId && areas.find(a => a._id === areaId) && (
                <span className="text-[#1a4a8a]">, {areas.find(a => a._id === areaId)?.name}</span>
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
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <p className="text-gray-400 font-semibold text-sm">No properties found</p>
              {chips.length > 0 && (
                <button onClick={clearAll} className="mt-3 text-xs text-[#1a4a8a] underline font-semibold">
                  Clear all filters
                </button>
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
                    : ['/placeholder.jpg']}
                  price={formatPrice(p.price)}
                  title={p.title}
                  beds={p.bedrooms}
                  baths={p.bathrooms}
                  area={formatSize(p.marla, p.kanal)}
                  location={`${p.area?.name ?? ''}, ${p.city?.name ?? ''}`}
                  type={p.propertyType?.name ?? 'Property'}
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