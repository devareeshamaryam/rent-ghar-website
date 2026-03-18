'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddTypePage() {
  const router = useRouter()
  const [name,    setName]    = useState('')
  const [slug,    setSlug]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const toSlug = (val: string) =>
    val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleName = (val: string) => {
    setName(val)
    setSlug(toSlug(val))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Type name is required'); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/types', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      router.push('/admin/types')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition"

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/types" className="text-gray-400 hover:text-gray-600 transition">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Add Property Type</h1>
          <p className="text-xs text-gray-400 mt-0.5">e.g. House, Apartment, Flat, Plot</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Type Name <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls}
              placeholder="e.g. House"
              value={name}
              onChange={e => handleName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug</label>
            <input className={inputCls + ' bg-gray-50 text-gray-400 cursor-not-allowed'}
              value={slug} readOnly placeholder="auto-generated" />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#042C53] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#063a6e] disabled:opacity-60 transition">
              {loading ? 'Saving...' : 'Add Type'}
            </button>
            <Link href="/admin/types"
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 transition text-center">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}