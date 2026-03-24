'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Property {
  _id:      string
  propertyId: string
  title:    string
  price:    number
  status:   string
  mainPhoto: string
  bedrooms:  number
  bathrooms: number
  marla:    number
  kanal:    number
  propertyType: { name: string }
  city:     { name: string }
  area:     { name: string }
  views:    number
  createdAt: string
}

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
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return 'Today'
}

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-green-50 text-green-600',
  pending:  'bg-amber-50 text-amber-600',
  rejected: 'bg-red-50 text-red-500',
  expired:  'bg-gray-100 text-gray-400',
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading,    setLoading]    = useState(true)
  const [deleting,   setDeleting]   = useState<string | null>(null)

  useEffect(() => {
    // TODO: replace with /api/user/properties after auth
    fetch('/api/properties?limit=50')
      .then(r => r.json())
      .then(d => setProperties(d.data || []))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      setProperties(prev => prev.filter(p => p._id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">My Properties</h1>
          <p className="text-xs text-gray-400 mt-1">{properties.length} listings</p>
        </div>
        <Link href="/dashboard/subscription"
          className="bg-[#042C53] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#063a6e] transition flex items-center gap-2">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Listing
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-36 bg-gray-100"/>
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4"/>
                <div className="h-3 bg-gray-100 rounded w-1/2"/>
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
          <svg className="w-12 h-12 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <p className="text-gray-400 text-sm mb-1">No properties listed yet</p>
          <p className="text-gray-300 text-xs mb-4">You need an active subscription to list properties</p>
          <Link href="/dashboard/subscription"
            className="bg-[#042C53] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#063a6e] transition">
            View Packages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {properties.map(p => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">

              {/* Image */}
              <div className="relative h-36 bg-gray-100">
                {p.mainPhoto
                  ? <img src={p.mainPhoto} alt={p.title} className="w-full h-full object-cover"/>
                  : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="28" height="28" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  )
                }
                {/* Status badge */}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}>
                  {p.status}
                </span>
                {/* Views */}
                <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  {p.views || 0}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">{p.title}</p>
                  <p className="text-sm font-bold text-[#042C53] shrink-0">PKR {formatPrice(p.price)}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                  <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  </svg>
                  {p.area?.name}, {p.city?.name}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-4">
                  {p.bedrooms > 0 && <span>{p.bedrooms} Beds</span>}
                  {p.bathrooms > 0 && <span>{p.bathrooms} Baths</span>}
                  <span>{formatSize(p.marla, p.kanal)}</span>
                  <span className="ml-auto">{timeAgo(p.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t border-gray-50 pt-3">
                  <a href={`/listings/${p._id}`} target="_blank"
                    className="flex-1 text-center py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    View
                  </a>
                  <Link href={`/admin/properties/${p._id}/edit`}
                    className="flex-1 text-center py-1.5 text-xs font-medium text-[#042C53] border border-[#042C53] rounded-lg hover:bg-[#042C53] hover:text-white transition">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    disabled={deleting === p._id}
                    className="flex-1 py-1.5 text-xs font-medium text-red-400 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40 transition">
                    {deleting === p._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}