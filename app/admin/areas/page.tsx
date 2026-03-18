'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Area {
  _id:      string
  name:     string
  slug:     string
  city:     { _id: string; name: string }
  isActive: boolean
}

export default function AllAreasPage() {
  const [areas,    setAreas]    = useState<Area[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchAreas = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/areas')
      const data = await res.json()
      setAreas(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAreas() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/areas/${id}`, { method: 'DELETE' })
      setAreas(prev => prev.filter(a => a._id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">All Areas</h1>
          <p className="text-xs text-gray-400 mt-1">{areas.length} areas total</p>
        </div>
        <Link href="/admin/areas/add"
          className="bg-[#042C53] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#063a6e] transition">
          + Add Area
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
        ) : areas.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm mb-3">No areas added yet</p>
            <Link href="/admin/areas/add" className="text-[#042C53] text-sm font-semibold underline">
              Add your first area
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Area Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Slug</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area, i) => (
                <tr key={area._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{area.name}</td>
                  <td className="px-5 py-3">
                    <span className="bg-blue-50 text-[#042C53] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {area.city?.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{area.slug}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(area._id, area.name)}
                      disabled={deleting === area._id}
                      className="text-xs text-red-400 hover:text-red-600 font-medium disabled:opacity-40 transition">
                      {deleting === area._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}