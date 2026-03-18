'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Property {
  _id:          string
  propertyId:   string
  title:        string
  price:        number
  status:       string
  mainPhoto:    string
  bedrooms:     number
  bathrooms:    number
  marla:        number
  kanal:        number
  propertyType: { name: string }
  city:         { name: string }
  area:         { name: string }
  createdAt:    string
  views:        number
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

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-green-50 text-green-600',
  pending:  'bg-amber-50 text-amber-600',
  rejected: 'bg-red-50 text-red-500',
  expired:  'bg-gray-100 text-gray-500',
}

export default function AllPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading,    setLoading]    = useState(true)
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [search,     setSearch]     = useState('')
  const [status,     setStatus]     = useState('')
  const [deleting,   setDeleting]   = useState<string | null>(null)

  const LIMIT = 10

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page: String(page), limit: String(LIMIT) })
      if (status) q.set('status', status)
      const res  = await fetch(`/api/properties?${q}`)
      const data = await res.json()
      setProperties(data.data || [])
      setTotal(data.pagination?.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProperties() }, [page, status])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      setProperties(prev => prev.filter(p => p._id !== id))
      setTotal(t => t - 1)
    } finally {
      setDeleting(null)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/properties/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: newStatus }),
    })
    setProperties(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p))
  }

  const filtered = search
    ? properties.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.propertyId?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : properties

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">All Properties</h1>
          <p className="text-xs text-gray-400 mt-1">{total} properties total</p>
        </div>
        <Link href="/admin/properties/add"
          className="bg-[#042C53] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#063a6e] transition flex items-center gap-2">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by title, ID, city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition w-64"
        />
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#042C53] transition">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <svg className="w-10 h-10 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <p className="text-gray-400 text-sm">No properties found</p>
            <Link href="/admin/properties/add" className="text-[#042C53] text-xs font-semibold underline mt-2 inline-block">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Property</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Details</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Views</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition">

                    {/* Photo + Title */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {p.mainPhoto ? (
                            <img src={p.mainPhoto} alt={p.title}
                              className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[180px] text-xs">{p.title}</p>
                          <p className="text-[11px] text-gray-400">{p.propertyType?.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Property ID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-gray-500">{p.propertyId}</span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700 font-medium">{p.area?.name}</p>
                      <p className="text-[11px] text-gray-400">{p.city?.name}</p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-[#042C53]">PKR {formatPrice(p.price)}</p>
                      <p className="text-[11px] text-gray-400">/month</p>
                    </td>

                    {/* Details */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        {p.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8M2 12V7a2 2 0 012-2h4l2 3h8a2 2 0 012 2v2"/>
                            </svg>
                            {p.bedrooms}
                          </span>
                        )}
                        {p.bathrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h4v8M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/>
                            </svg>
                            {p.bathrooms}
                          </span>
                        )}
                        <span>{formatSize(p.marla, p.kanal)}</span>
                      </div>
                    </td>

                    {/* Views */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{p.views ?? 0}</span>
                    </td>

                    {/* Status dropdown */}
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={e => handleStatusChange(p._id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-500'}`}>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="expired">Expired</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <a href={`/listings/${p._id}`} target="_blank"
                          className="text-[11px] text-gray-400 hover:text-[#042C53] transition font-medium">
                          View
                        </a>
                        <Link href={`/admin/properties/${p._id}/edit`}
                          className="text-[11px] text-[#042C53] hover:underline font-medium">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          disabled={deleting === p._id}
                          className="text-[11px] text-red-400 hover:text-red-600 font-medium disabled:opacity-40 transition">
                          {deleting === p._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-xs font-bold border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition">
            ← Prev
          </button>
          <span className="text-xs text-gray-500 font-medium">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-xs font-bold border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-30 transition">
            Next →
          </button>
        </div>
      )}

    </div>
  )
}