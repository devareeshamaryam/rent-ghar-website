 'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('@/app/components/admin/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[120px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
      <p className="text-xs text-gray-400">Loading editor...</p>
    </div>
  ),
})

interface City { _id: string; name: string }

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition bg-white'

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)

export default function AddAreaPage() {
  const router = useRouter()

  // Basic
  const [name,   setName]   = useState('')
  const [slug,   setSlug]   = useState('')
  const [cityId, setCityId] = useState('')
  const [cities, setCities] = useState<City[]>([])

  // General SEO
  const [metaTitle,       setMetaTitle]       = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [canonicalUrl,    setCanonicalUrl]    = useState('')
  const [description,     setDescription]     = useState('')

  // Rent SEO
  const [rentMetaTitle,       setRentMetaTitle]       = useState('')
  const [rentMetaDescription, setRentMetaDescription] = useState('')
  const [rentContent,         setRentContent]         = useState('')

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.data || []))
  }, [])

  const toSlug = (val: string) =>
    val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleName = (val: string) => {
    setName(val)
    setSlug(toSlug(val))
    setError('')
    // Auto-generate SEO fields if empty
    if (!metaTitle)       setMetaTitle(`${val} Properties | RentGhars`)
    if (!metaDescription) setMetaDescription(`Find rental properties in ${val}. Browse houses, apartments, flats and more on RentGhars.`)
    if (!rentMetaTitle)   setRentMetaTitle(`Houses for Rent in ${val} | RentGhars`)
    if (!rentMetaDescription) setRentMetaDescription(`Browse houses, apartments and flats for rent in ${val}. Find your perfect home on RentGhars.`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Area name is required'); return }
    if (!cityId)      { setError('Please select a city'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/areas', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(), city: cityId,
          metaTitle, metaDescription, canonicalUrl, description,
          rentMetaTitle, rentMetaDescription, rentContent,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      router.push('/admin/areas')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/areas" className="text-gray-400 hover:text-gray-600 transition">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Add New Area</h1>
          <p className="text-xs text-gray-400 mt-0.5">Add an area to a city to make it available for property listings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Basic Info ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">

          <div>
            <Label required>City</Label>
            <select className={inputCls} value={cityId}
              onChange={e => { setCityId(e.target.value); setError('') }}>
              <option value="">Select a city</option>
              {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {cities.length === 0 && (
              <p className="text-[11px] text-amber-500 mt-1">
                No cities found.{' '}
                <Link href="/admin/cities/add" className="underline font-semibold">Add a city first</Link>
              </p>
            )}
          </div>

          <div>
            <Label required>Area Name</Label>
            <input className={inputCls} placeholder="e.g. DHA Phase 5"
              value={name} onChange={e => handleName(e.target.value)} />
          </div>

          <div>
            <Label required>Area Slug</Label>
            <input className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
              value={slug} readOnly placeholder="e.g. dha-phase-5" />
            <p className="text-[11px] text-gray-400 mt-1">Auto-generated from area name</p>
          </div>
        </div>

        {/* ── General SEO ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-800">General SEO</h2>
          </div>
          <div className="p-6 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meta Title</Label>
                <input className={inputCls} placeholder="SEO Title"
                  value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
                <div className="flex justify-between mt-1">
                  <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                  <p className={`text-[11px] font-medium ${metaTitle.length > 60 ? 'text-red-400' : 'text-gray-400'}`}>
                    {metaTitle.length}/60
                  </p>
                </div>
              </div>
              <div>
                <Label>Canonical URL</Label>
                <input className={inputCls} placeholder="https://example.com/area"
                  value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Meta Description</Label>
              <textarea rows={2} className={`${inputCls} resize-none`}
                placeholder="SEO Description"
                value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
              <div className="flex justify-between mt-1">
                <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                <p className={`text-[11px] font-medium ${metaDescription.length > 160 ? 'text-red-400' : 'text-gray-400'}`}>
                  {metaDescription.length}/160
                </p>
              </div>
            </div>

            <div>
              <Label>Area Description <span className="text-gray-400 font-normal text-[11px]">(Rich Text — General)</span></Label>
              <RichEditor value={description} onChange={setDescription}
                placeholder="Write a general description of this area..." />
            </div>

          </div>
        </div>

        {/* ── Rent Page SEO ── */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-50">
            <h2 className="text-sm font-semibold text-[#042C53]">Rent Page SEO & Content</h2>
            <p className="text-[11px] text-blue-400 mt-0.5">
              Shown on /listings?city=...&area=... pages. If left empty, general SEO is used.
            </p>
          </div>
          <div className="p-6 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  <span className="text-[#042C53]">Rent Meta Title</span>
                </Label>
                <input className={inputCls} placeholder="e.g. Houses for Rent in DHA Phase 5"
                  value={rentMetaTitle} onChange={e => setRentMetaTitle(e.target.value)} />
                <div className="flex justify-between mt-1">
                  <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                  <p className={`text-[11px] font-medium ${rentMetaTitle.length > 60 ? 'text-red-400' : 'text-gray-400'}`}>
                    {rentMetaTitle.length}/60
                  </p>
                </div>
              </div>
              <div>
                <Label>
                  <span className="text-[#042C53]">Rent Meta Description</span>
                </Label>
                <textarea rows={2} className={`${inputCls} resize-none`}
                  placeholder="Rent meta description"
                  value={rentMetaDescription} onChange={e => setRentMetaDescription(e.target.value)} />
                <div className="flex justify-between mt-1">
                  <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                  <p className={`text-[11px] font-medium ${rentMetaDescription.length > 160 ? 'text-red-400' : 'text-gray-400'}`}>
                    {rentMetaDescription.length}/160
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label>
                <span className="text-[#042C53]">Rent Content</span>
                <span className="text-gray-400 font-normal text-[11px] ml-1">(Rich Text)</span>
              </Label>
              <RichEditor value={rentContent} onChange={setRentContent}
                placeholder="Write content specific to rental properties in this area..." />
            </div>

          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
        )}

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={loading}
            className="flex-1 bg-[#042C53] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#063a6e] disabled:opacity-60 transition">
            {loading ? 'Saving...' : 'Add Area'}
          </button>
          <Link href="/admin/areas"
            className="px-8 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition text-center">
            Cancel
          </Link>
        </div>

      </form>
    </div>
  )
}