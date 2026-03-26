 'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Property {
  _id:          string
  propertyId:   string
  title:        string
  price:        number
  marla:        number
  kanal:        number
  bedrooms:     number
  bathrooms:    number
  mainPhoto:    string
  purpose:      string
  status:       string
  city?:         { name: string } | string
  area?:         { name: string } | string
  propertyType?: { name: string } | string
}

function getName(field: { name: string } | string | undefined): string {
  if (!field) return ''
  if (typeof field === 'object') return field.name ?? ''
  return ''
}

function formatPrice(n: number) {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)} Cr`
  if (n >= 100_000)    return `${(n / 100_000).toFixed(1)} Lac`
  return n.toLocaleString()
}

function formatSize(marla: number, kanal: number) {
  if (kanal > 0) return `${kanal} Kanal`
  if (marla > 0) return `${marla} Marla`
  return '—'
}

const LIMIT = 8

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition bg-white'

export default function AddFeaturedPage() {
  const router = useRouter()

  const [properties,  setProperties]  = useState<Property[]>([])
  const [total,       setTotal]       = useState(0)
  const [page,        setPage]        = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState('')
  const [search,      setSearch]      = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [startDate,        setStartDate]         = useState(new Date().toISOString().split('T')[0])
  const [endDate,          setEndDate]           = useState('')

  const totalPages = Math.ceil(total / LIMIT)

  const fetchProperties = async (p: number, q: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) })
      const res    = await fetch(`/api/properties?${params}`)
      const data   = await res.json()
      const list: Property[] = data.data || []

      const filtered = q.trim()
        ? list.filter(prop => {
            const qq = q.toLowerCase()
            return (
              prop.title?.toLowerCase().includes(qq) ||
              getName(prop.city).toLowerCase().includes(qq) ||
              getName(prop.area).toLowerCase().includes(qq) ||
              getName(prop.propertyType).toLowerCase().includes(qq)
            )
          })
        : list

      setProperties(filtered)
      setTotal(data.pagination?.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(page, search)
  }, [page, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  const handleSubmit = async () => {
    setError('')
    if (!selectedProperty) { setError('Koi property select karo'); return }
    if (!endDate)            { setError('End date zaroori hai'); return }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date, start date se baad honi chahiye')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/featured', {   // ✅ /api/featured
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          propertyId: selectedProperty._id,
          startDate,
          endDate,
        }),
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin/featured')
      } else {
        setError(data.message || 'Kuch masla aa gaya')
      }
    } catch {
      setError('Server error, baad mein try karo')
    } finally {
      setSubmitting(false)
    }
  }

  const durationDays =
    startDate && endDate && new Date(endDate) > new Date(startDate)
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
      : null

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/featured" className="text-gray-400 hover:text-gray-600 transition">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Add Featured Listing</h1>
          <p className="text-xs text-gray-400 mt-0.5">Property select karo, dates set karo, publish karo</p>
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* ── LEFT: Properties Table ── */}
        <div className="flex-1 min-w-0">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                className={`${inputCls} pl-9`}
                placeholder="Title, city, area ya type se search..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit"
              className="px-4 py-2.5 bg-[#042C53] text-white text-sm font-medium rounded-lg hover:bg-[#063a6e] transition">
              Search
            </button>
            {search && (
              <button type="button"
                onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
                className="px-3 py-2.5 border border-gray-200 text-gray-400 text-sm rounded-lg hover:bg-gray-50 transition">
                ✕
              </button>
            )}
          </form>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-sm text-gray-400">Properties load ho rahi hain...</div>
            ) : properties.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-400">Koi property nahi mili</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-8"></th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Property</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Size</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Price</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p, i) => {
                      const isSelected = selectedProperty?._id === p._id
                      return (
                        <tr key={p._id}
                          onClick={() => setSelectedProperty(isSelected ? null : p)}
                          className={`border-b border-gray-50 transition cursor-pointer ${
                            isSelected ? 'bg-[#042C53]/5 border-l-2 border-l-[#042C53]' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className={`w-4 h-4 rounded-full border-2 transition flex items-center justify-center ${
                              isSelected ? 'border-[#042C53] bg-[#042C53]' : 'border-gray-300'
                            }`}>
                              {isSelected && <svg width="8" height="8" fill="white" viewBox="0 0 8 8"><circle cx="4" cy="4" r="2" /></svg>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                {p.mainPhoto
                                  ? <img src={p.mainPhoto} alt={p.title} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center">
                                      <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                      </svg>
                                    </div>
                                }
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-800 text-xs truncate max-w-[160px]">{p.title}</p>
                                <p className="text-[11px] text-gray-400">{getName(p.propertyType)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-700">{getName(p.area)}</p>
                            <p className="text-[11px] text-gray-400">{getName(p.city)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-600">{formatSize(p.marla, p.kanal)}</p>
                            {p.bedrooms > 0 && <p className="text-[11px] text-gray-400">{p.bedrooms} Bed</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs font-semibold text-[#042C53]">PKR {formatPrice(p.price)}</p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setSelectedProperty(isSelected ? null : p) }}
                              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition ${
                                isSelected
                                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                  : 'bg-[#042C53]/10 text-[#042C53] hover:bg-[#042C53]/20'
                              }`}
                            >
                              {isSelected ? 'Deselect' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400">Page {page} of {totalPages} • {total} properties</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition">
                  ← Prev
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition">
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="w-72 shrink-0 space-y-4 sticky top-6">

          {/* Selected Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xs font-semibold text-gray-700">Selected Property</h2>
            </div>
            <div className="p-4">
              {selectedProperty ? (
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {selectedProperty.mainPhoto
                      ? <img src={selectedProperty.mainPhoto} alt={selectedProperty.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{selectedProperty.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {getName(selectedProperty.area)}, {getName(selectedProperty.city)}
                    </p>
                    <p className="text-[11px] font-semibold text-[#042C53] mt-1">
                      PKR {formatPrice(selectedProperty.price)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-3">Table se property select karo</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xs font-semibold text-gray-700">Featured Period</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Start Date</label>
                <input type="date" className={inputCls} value={startDate}
                  onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input type="date" className={inputCls} value={endDate} min={startDate}
                  onChange={e => setEndDate(e.target.value)} />
              </div>
              {durationDays && (
                <div className="text-[11px] text-[#042C53] bg-[#042C53]/5 border border-[#042C53]/10 rounded-lg px-3 py-2 text-center">
                  ⭐ <strong>{durationDays} din</strong> tak featured rahegi
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">{error}</p>
          )}

          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 text-[11px] text-amber-700">
            <strong>Note:</strong> Ek property sirf ek baar featured ho sakti hai.
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedProperty || !endDate}
              className="w-full bg-[#042C53] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#063a6e] disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : '⭐ Featured Karo'}
            </button>
            <Link href="/admin/featured"
              className="block w-full text-center py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}