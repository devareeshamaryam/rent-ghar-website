'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PropertyType {
  _id:      string
  name:     string
  slug:     string
  isActive: boolean
}

export default function AllTypesPage() {
  const [types,    setTypes]    = useState<PropertyType[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchTypes = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/types')
      const data = await res.json()
      setTypes(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTypes() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/types/${id}`, { method: 'DELETE' })
      setTypes(prev => prev.filter(t => t._id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">All Property Types</h1>
          <p className="text-xs text-gray-400 mt-1">{types.length} types total</p>
        </div>
        <Link href="/admin/types/add"
          className="bg-[#042C53] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#063a6e] transition">
          + Add Type
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading...</div>
        ) : types.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm mb-3">No property types added yet</p>
            <Link href="/admin/types/add" className="text-[#042C53] text-sm font-semibold underline">
              Add your first type
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Type Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type, i) => (
                <tr key={type._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{type.name}</td>
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{type.slug}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      type.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {type.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(type._id, type.name)}
                      disabled={deleting === type._id}
                      className="text-xs text-red-400 hover:text-red-600 font-medium disabled:opacity-40 transition">
                      {deleting === type._id ? 'Deleting...' : 'Delete'}
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