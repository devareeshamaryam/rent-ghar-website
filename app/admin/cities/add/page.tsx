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

// ── Helpers ──────────────────────────────────────────────────
const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition bg-white'

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) => (
  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)

const CharCount = ({ value, max }: { value: string; max: number }) => (
  <p className={`text-[11px] font-medium ${value.length > max ? 'text-red-400' : 'text-gray-400'}`}>
    {value.length}/{max}
  </p>
)

// ── Property-Type Content Block ───────────────────────────────
interface PropertyTypeBlock {
  id:             string   // local uuid
  propertyTypeId: string
  purpose:        string
  metaTitle:      string
  metaDescription: string
  content:        string
}

interface RefItem { _id: string; name: string }

// ─────────────────────────────────────────────────────────────
export default function AddCityPage() {
  const router = useRouter()

  // Basic
  const [name,      setName]      = useState('')
  const [slug,      setSlug]      = useState('')
  const [state,     setState]     = useState('')
  const [country,   setCountry]   = useState('')
  const [thumbnail, setThumbnail] = useState('')

  // General SEO
  const [metaTitle,       setMetaTitle]       = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [canonicalUrl,    setCanonicalUrl]    = useState('')
  const [description,     setDescription]     = useState('')

  // Rent SEO
  const [rentMetaTitle,       setRentMetaTitle]       = useState('')
  const [rentMetaDescription, setRentMetaDescription] = useState('')
  const [rentContent,         setRentContent]         = useState('')

  // Buy SEO
  const [buyMetaTitle,       setBuyMetaTitle]       = useState('')
  const [buyMetaDescription, setBuyMetaDescription] = useState('')
  const [buyContent,         setBuyContent]         = useState('')

  // Property-type specific
  const [ptBlocks, setPtBlocks] = useState<PropertyTypeBlock[]>([])
  const [ptTypes,  setPtTypes]  = useState<RefItem[]>([])

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  // Load property types for the dropdown
  useEffect(() => {
    fetch('/api/types')
      .then(r => r.json())
      .then(d => setPtTypes(d.data || []))
  }, [])

  // ── Slug + auto-fill SEO ──────────────────────────────────
  const toSlug = (val: string) =>
    val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleName = (val: string) => {
    setName(val)
    setSlug(toSlug(val))
    setError('')
    if (!metaTitle)            setMetaTitle(`Properties in ${val} | RentGhars`)
    if (!metaDescription)      setMetaDescription(`Find properties for rent and sale in ${val}. Browse houses, apartments and more on RentGhars.`)
    if (!rentMetaTitle)        setRentMetaTitle(`Houses for Rent in ${val} | RentGhars`)
    if (!rentMetaDescription)  setRentMetaDescription(`Browse houses, apartments and flats for rent in ${val}. Find your perfect home on RentGhars.`)
    if (!buyMetaTitle)         setBuyMetaTitle(`Properties for Sale in ${val} | RentGhars`)
    if (!buyMetaDescription)   setBuyMetaDescription(`Browse properties for sale in ${val}. Find your dream home on RentGhars.`)
  }

  // ── Property-Type Block helpers ───────────────────────────
  const addPtBlock = () =>
    setPtBlocks(prev => [
      ...prev,
      { id: Date.now().toString(), propertyTypeId: '', purpose: 'rent', metaTitle: '', metaDescription: '', content: '' },
    ])

  const removePtBlock = (id: string) =>
    setPtBlocks(prev => prev.filter(b => b.id !== id))

  const updatePtBlock = (id: string, field: keyof PropertyTypeBlock, value: string) =>
    setPtBlocks(prev => prev.map(b => (b.id === id ? { ...b, [field]: value } : b)))

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('City name is required'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/cities', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          state, country, thumbnail,
          metaTitle, metaDescription, canonicalUrl, description,
          rentMetaTitle, rentMetaDescription, rentContent,
          buyMetaTitle,  buyMetaDescription,  buyContent,
          propertyTypeContent: ptBlocks.map(b => ({
            propertyType:    b.propertyTypeId,
            purpose:         b.purpose,
            metaTitle:       b.metaTitle,
            metaDescription: b.metaDescription,
            content:         b.content,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message); return }
      router.push('/admin/cities')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── UI ────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/cities" className="text-gray-400 hover:text-gray-600 transition">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Add New City</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Add a city to make it available for property listings. Only the city name is required and must be unique.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Basic Info ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">

          {/* City Name */}
          <div>
            <Label required>City Name</Label>
            <input className={inputCls} placeholder="e.g. Karachi"
              value={name} onChange={e => handleName(e.target.value)} />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug</Label>
            <input className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
              value={slug} readOnly placeholder="auto-generated" />
            <p className="text-[11px] text-gray-400 mt-1">Auto-generated from city name</p>
          </div>

          {/* State + Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>State / Province <span className="text-gray-400 font-normal">(Optional)</span></Label>
              <input className={inputCls} placeholder="e.g. Sindh"
                value={state} onChange={e => setState(e.target.value)} />
            </div>
            <div>
              <Label>Country <span className="text-gray-400 font-normal">(Optional)</span></Label>
              <input className={inputCls} placeholder="e.g. Pakistan"
                value={country} onChange={e => setCountry(e.target.value)} />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <Label>City Thumbnail <span className="text-gray-400 font-normal">(Optional)</span></Label>
            <input className={inputCls} placeholder="Image URL or choose from gallery"
              value={thumbnail} onChange={e => setThumbnail(e.target.value)} />
            {thumbnail && (
              <img src={thumbnail} alt="preview"
                className="mt-2 h-24 w-auto rounded-lg border border-gray-100 object-cover" />
            )}
          </div>
        </div>

        {/* ── General SEO ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-800">General SEO</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Used as the default for all city pages.</p>
          </div>
          <div className="p-6 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meta Title (SEO)</Label>
                <input className={inputCls} placeholder="SEO Title"
                  value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
                <div className="flex justify-between mt-1">
                  <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                  <CharCount value={metaTitle} max={60} />
                </div>
              </div>
              <div>
                <Label>Canonical URL</Label>
                <input className={inputCls} placeholder="https://example.com/city"
                  value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Meta Description (SEO)</Label>
              <textarea rows={2} className={`${inputCls} resize-none`}
                placeholder="SEO Description"
                value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
              <div className="flex justify-between mt-1">
                <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                <CharCount value={metaDescription} max={160} />
              </div>
            </div>

            <div>
              <Label>
                City Description{' '}
                <span className="text-gray-400 font-normal text-[11px]">(Rich Text — General)</span>
              </Label>
              <RichEditor value={description} onChange={setDescription}
                placeholder="Write a general description of this city..." />
            </div>
          </div>
        </div>

        {/* ── Specific Content Sections ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-800">Specific Content Sections</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Define specific content for different property purposes. If left empty, the general description above will be used.
            </p>
          </div>
          <div className="p-6 space-y-6">

            {/* Rent */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    <span className="text-[#042C53]">Rent Meta Title (SEO)</span>
                  </Label>
                  <input className={inputCls} placeholder="Meta title for rent page"
                    value={rentMetaTitle} onChange={e => setRentMetaTitle(e.target.value)} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                    <CharCount value={rentMetaTitle} max={60} />
                  </div>
                </div>
                <div>
                  <Label>
                    <span className="text-[#042C53]">Rent Meta Description (SEO)</span>
                  </Label>
                  <textarea rows={2} className={`${inputCls} resize-none`}
                    placeholder="Meta description for rent page"
                    value={rentMetaDescription} onChange={e => setRentMetaDescription(e.target.value)} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                    <CharCount value={rentMetaDescription} max={160} />
                  </div>
                </div>
              </div>
              <div>
                <Label>
                  <span className="text-[#042C53]">Rent Content</span>
                  <span className="text-gray-400 font-normal text-[11px] ml-1">(Rich Text)</span>
                </Label>
                <RichEditor value={rentContent} onChange={setRentContent}
                  placeholder="Write content specific to rental properties in this city..." />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Buy */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>
                    <span className="text-green-700">Buy Meta Title (SEO)</span>
                  </Label>
                  <input className={inputCls} placeholder="Meta title for buy page"
                    value={buyMetaTitle} onChange={e => setBuyMetaTitle(e.target.value)} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                    <CharCount value={buyMetaTitle} max={60} />
                  </div>
                </div>
                <div>
                  <Label>
                    <span className="text-green-700">Buy Meta Description (SEO)</span>
                  </Label>
                  <textarea rows={2} className={`${inputCls} resize-none`}
                    placeholder="Meta description for buy page"
                    value={buyMetaDescription} onChange={e => setBuyMetaDescription(e.target.value)} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Auto-generated if left empty</p>
                    <CharCount value={buyMetaDescription} max={160} />
                  </div>
                </div>
              </div>
              <div>
                <Label>
                  <span className="text-green-700">Buy Content</span>
                  <span className="text-gray-400 font-normal text-[11px] ml-1">(Rich Text)</span>
                </Label>
                <RichEditor value={buyContent} onChange={setBuyContent}
                  placeholder="Write content specific to properties for sale in this city..." />
              </div>
            </div>
          </div>
        </div>

        {/* ── Property Type Specific Content ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Property Type Specific Content</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Add custom content for specific combinations like &quot;House for Rent in City&quot;
              </p>
            </div>
            <button type="button" onClick={addPtBlock}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#042C53] border border-[#042C53] px-3 py-1.5 rounded-lg hover:bg-[#042C53] hover:text-white transition">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
              </svg>
              Add Specific Type Content
            </button>
          </div>

          <div className="p-6 space-y-5">
            {ptBlocks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                No specific type content yet. Click &quot;Add Specific Type Content&quot; to add one.
              </p>
            )}

            {ptBlocks.map((block, idx) => (
              <div key={block.id} className="border border-gray-200 rounded-xl p-5 space-y-4 relative">
                {/* Delete */}
                <button type="button" onClick={() => removePtBlock(block.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>

                <p className="text-xs font-semibold text-gray-500">Block #{idx + 1}</p>

                {/* Property Type + Purpose */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label required>Property Type</Label>
                    <select className={inputCls}
                      value={block.propertyTypeId}
                      onChange={e => updatePtBlock(block.id, 'propertyTypeId', e.target.value)}>
                      <option value="">Select type</option>
                      {ptTypes.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <select className={inputCls}
                      value={block.purpose}
                      onChange={e => updatePtBlock(block.id, 'purpose', e.target.value)}>
                      <option value="rent">Rent</option>
                      <option value="buy">Buy</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Meta Title</Label>
                    <input className={inputCls} placeholder="SEO Title"
                      value={block.metaTitle}
                      onChange={e => updatePtBlock(block.id, 'metaTitle', e.target.value)} />
                    <div className="flex justify-end mt-1">
                      <CharCount value={block.metaTitle} max={60} />
                    </div>
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <input className={inputCls} placeholder="SEO Description"
                      value={block.metaDescription}
                      onChange={e => updatePtBlock(block.id, 'metaDescription', e.target.value)} />
                    <div className="flex justify-end mt-1">
                      <CharCount value={block.metaDescription} max={160} />
                    </div>
                  </div>
                </div>

                {/* Rich Content */}
                <div>
                  <Label>Rich Content</Label>
                  <RichEditor
                    value={block.content}
                    onChange={val => updatePtBlock(block.id, 'content', val)}
                    placeholder={`Write content for ${block.propertyTypeId ? ptTypes.find(t => t._id === block.propertyTypeId)?.name || 'this type' : 'this type'} ...`}
                  />
                </div>
              </div>
            ))}
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
            {loading ? 'Saving...' : 'Add City'}
          </button>
          <Link href="/admin/cities"
            className="px-8 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition text-center">
            Cancel
          </Link>
        </div>

      </form>
    </div>
  )
}