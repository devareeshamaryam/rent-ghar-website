'use client'

// app/admin/featured/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PopulatedRef { name: string; slug?: string }

interface FeaturedItem {
  _id:       string
  property: {
    _id:          string
    title:        string
    slug:         string
    price:        number
    marla:        number
    kanal:        number
    bedrooms:     number
    bathrooms:    number
    mainPhoto:    string
    purpose:      string
    city?:         PopulatedRef
    area?:         PopulatedRef
    propertyType?: PopulatedRef
  }
  startDate: string
  endDate:   string
  isActive:  boolean
  addedBy:   { name: string; email: string }
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

export default function AllFeaturedPage() {
  const [featured,   setFeatured]   = useState<FeaturedItem[]>([])
  const [loading,    setLoading]    = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchFeatured = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/featured')
      const data = await res.json()
      if (data.success) setFeatured(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFeatured() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" ko featured se remove karna chahte hain?`)) return
    setDeletingId(id)
    try {
      const res  = await fetch(`/api/admin/featured/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) setFeatured(prev => prev.filter(f => f._id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    try {
      const res  = await fetch(`/api/admin/featured/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isActive: !current }),
      })
      const data = await res.json()
      if (data.success)
        setFeatured(prev => prev.map(f => f._id === id ? { ...f, isActive: !current } : f))
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Featured Listings</h1>
          <p className="text-xs text-gray-400 mt-1">{featured.length} featured properties</p>
        </div>
        <Link
          href="/admin/featured/add"
          className="bg-[#042C53] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#063a6e] transition"
        >
          + Add Featured
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
        ) : featured.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto mb-3 text-gray-200" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p className="text-gray-400 text-sm mb-3">Koi featured listing nahi hai abhi</p>
            <Link href="/admin/featured/add" className="text-[#042C53] text-sm font-semibold underline">
              Pehli featured listing add karo
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Property</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Details</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Period</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Added By</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {featured.map((item, i) => {
                const p         = item.property
                const isExpired = new Date(item.endDate) < new Date()

                return (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition">

                    {/* # */}
                    <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>

                    {/* Property — thumbnail + title */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.mainPhoto ? (
                          <img
                            src={p.mainPhoto}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[160px]">{p.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {p.area?.name}{p.city?.name ? `, ${p.city.name}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Details — price, type, size */}
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-800">PKR {formatPrice(p.price)}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {p.propertyType?.name || '—'} • {formatSize(p.marla, p.kanal)}
                        {p.bedrooms ? ` • ${p.bedrooms} Bed` : ''}
                      </p>
                    </td>

                    {/* Period */}
                    <td className="px-5 py-3">
                      <p className="text-xs text-gray-600">
                        {new Date(item.startDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className={`text-xs mt-0.5 font-medium ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                        {isExpired ? '⚠ Expired: ' : 'Ends: '}
                        {new Date(item.endDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>

                    {/* Added By */}
                    <td className="px-5 py-3 text-gray-500 text-xs">{item.addedBy?.name || '—'}</td>

                    {/* Status toggle */}
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggle(item._id, item.isActive)}
                        disabled={togglingId === item._id}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition disabled:opacity-50 ${
                          item.isActive
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-red-50 text-red-400 hover:bg-red-100'
                        }`}
                      >
                        {togglingId === item._id ? '...' : item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {/* View on site */}
                        <a
                          href={`/listings/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#042C53] hover:text-[#063a6e] font-medium transition"
                        >
                          View
                        </a>
                        {/* Remove */}
                        <button
                          onClick={() => handleDelete(item._id, p.title)}
                          disabled={deletingId === item._id}
                          className="text-xs text-red-400 hover:text-red-600 font-medium disabled:opacity-40 transition"
                        >
                          {deletingId === item._id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}