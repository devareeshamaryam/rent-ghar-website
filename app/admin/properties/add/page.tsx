 'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('@/app/components/admin/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[160px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
      <p className="text-xs text-gray-400">Loading editor...</p>
    </div>
  ),
})

const MapPicker = dynamic(() => import('@/app/components/admin/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
      <p className="text-xs text-gray-400">Loading map...</p>
    </div>
  ),
})

// ─── Feature definitions ──────────────────────────────────
interface FeatureDef {
  key: string
  label: string
  icon: React.ReactNode
}

const FEATURES: FeatureDef[] = [
  {
    key: 'tv_lounge', label: 'TV Lounge',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    key: 'kitchen', label: 'Kitchen',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  },
  {
    key: 'electricity', label: 'Electricity',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
  {
    key: 'water_supply', label: 'Water Supply',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  },
  {
    key: 'gas', label: 'Gas',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>,
  },
  {
    key: 'security', label: 'Security',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    key: 'parking', label: 'Parking',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>,
  },
  {
    key: 'internet', label: 'Internet',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  },
  {
    key: 'generator', label: 'Generator',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  },
  {
    key: 'lift', label: 'Lift / Elevator',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 10l3-3 3 3M9 14l3 3 3-3"/></svg>,
  },
  {
    key: 'swimming_pool', label: 'Swimming Pool',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 12h20M2 18c1.5-2 3-2 4.5 0S9 20 10.5 18s3-2 4.5 0S18 20 19.5 18 22 16 22 16"/><path d="M7 12V6a3 3 0 013-3h0a3 3 0 013 3v1"/><line x1="16" y1="9" x2="20" y2="5"/></svg>,
  },
  {
    key: 'gym', label: 'Gym',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6.5 6.5h11M6.5 17.5h11M3 10h18M3 14h18M2 10v4M22 10v4"/></svg>,
  },
  {
    key: 'store_room', label: 'Store Room',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
  },
  {
    key: 'servant_quarter', label: 'Servant Quarter',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    key: 'drawing_room', label: 'Drawing Room',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="8" width="18" height="12" rx="1"/><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"/><line x1="3" y1="14" x2="21" y2="14"/></svg>,
  },
  {
    key: 'dining_room', label: 'Dining Room',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  },
  {
    key: 'lawn', label: 'Lawn / Garden',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22V12M12 12C12 7 7 3 2 3c0 5 4 9 10 9zM12 12c0-5 5-9 10-9-1 5-5 9-10 9"/></svg>,
  },
]

// ─── Nearby categories ────────────────────────────────────
const NEARBY_CATEGORIES = ['Schools', 'Hospitals', 'Restaurants', 'Shopping'] as const
type NearbyCategory = typeof NEARBY_CATEGORIES[number]

// ─── Types ────────────────────────────────────────────────
interface NearbyItem { name: string; time: string }
type NearbyPlaces = Record<NearbyCategory, NearbyItem[]>

interface FormData {
  propertyType: string
  city: string
  area: string
  title: string
  slug: string
  address: string
  lat: number
  lng: number
  bedrooms: number
  bathrooms: number
  marla: number
  kanal: number
  price: string
  mainPhoto: File | null
  additionalPhotos: File[]
  description: string
  youtubeUrl: string
  features: string[]
  nearbyPlaces: NearbyPlaces
  contactNumber: string
  whatsappNumber: string
  metaTitle: string
  metaDescription: string
}

const PROPERTY_TYPES = ['House', 'Apartment', 'Flat', 'Room', 'Shop', 'Office', 'Plot', 'Portion']

const CITIES: Record<string, string[]> = {
  Karachi:   ['DHA', 'Gulshan-e-Iqbal', 'Clifton', 'North Nazimabad', 'PECHS', 'Bahria Town', 'Malir'],
  Lahore:    ['DHA', 'Bahria Town', 'Gulberg', 'Model Town', 'Johar Town', 'Garden Town'],
  Islamabad: ['F-6', 'F-7', 'F-8', 'G-9', 'G-11', 'Bahria Town', 'E-11'],
}

const DEFAULT_LAT = 30.3753
const DEFAULT_LNG = 69.3451

const EMPTY_NEARBY: NearbyPlaces = {
  Schools: [], Hospitals: [], Restaurants: [], Shopping: [],
}

// ─── Small reusable components ────────────────────────────
const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
      <h2 className="text-sm font-semibold text-[#042C53]">{title}</h2>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
)

// ─── Main Form ────────────────────────────────────────────
export default function AddPropertyPage() {
  const [form, setForm] = useState<FormData>({
    propertyType: '', city: '', area: '', title: '', slug: '',
    address: '', lat: DEFAULT_LAT, lng: DEFAULT_LNG,
    bedrooms: 0, bathrooms: 0, marla: 0, kanal: 0,
    price: '', mainPhoto: null, additionalPhotos: [],
    description: '', youtubeUrl: '', features: [],
    nearbyPlaces: EMPTY_NEARBY,
    contactNumber: '', whatsappNumber: '',
    metaTitle: '', metaDescription: '',
  })
  const [mainPreview, setMainPreview] = useState<string | null>(null)
  const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([])
  const [activeNearby, setActiveNearby] = useState<NearbyCategory>('Schools')
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')

  const handleTitle = (val: string) => {
    set('title', val)
    set('slug', toSlug(val))
    if (!form.metaTitle) set('metaTitle', val.slice(0, 60))
  }

  // ── Feature toggle ──
  const toggleFeature = (key: string) => {
    set('features', form.features.includes(key)
      ? form.features.filter(f => f !== key)
      : [...form.features, key]
    )
  }

  // ── Photos ──
  const handleMainPhoto = (file: File | null) => {
    set('mainPhoto', file)
    setMainPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleAdditional = (files: FileList) => {
    const arr = Array.from(files)
    set('additionalPhotos', [...form.additionalPhotos, ...arr])
    setAdditionalPreviews(p => [...p, ...arr.map(f => URL.createObjectURL(f))])
  }

  const removeAdditional = (i: number) => {
    setAdditionalPreviews(p => p.filter((_, idx) => idx !== i))
    set('additionalPhotos', form.additionalPhotos.filter((_, idx) => idx !== i))
  }

  // ── Nearby places ──
  const addNearbyItem = (cat: NearbyCategory) => {
    set('nearbyPlaces', {
      ...form.nearbyPlaces,
      [cat]: [...form.nearbyPlaces[cat], { name: '', time: '' }],
    })
  }

  const updateNearbyItem = (cat: NearbyCategory, i: number, field: keyof NearbyItem, val: string) => {
    const updated = [...form.nearbyPlaces[cat]]
    updated[i] = { ...updated[i], [field]: val }
    set('nearbyPlaces', { ...form.nearbyPlaces, [cat]: updated })
  }

  const removeNearbyItem = (cat: NearbyCategory, i: number) => {
    set('nearbyPlaces', {
      ...form.nearbyPlaces,
      [cat]: form.nearbyPlaces[cat].filter((_, idx) => idx !== i),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    alert('Property published! (API coming next)')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Add New Property</h1>
        <p className="text-xs text-gray-400 mt-1">Fill in all details to publish a listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── 1. Basic Info ── */}
        <Section title="Basic Information">
          <div>
            <Label required>Property Type</Label>
            <select className={inputCls} value={form.propertyType}
              onChange={e => set('propertyType', e.target.value)}>
              <option value="">Select property type</option>
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>City</Label>
              <select className={inputCls} value={form.city}
                onChange={e => { set('city', e.target.value); set('area', '') }}>
                <option value="">Select city</option>
                {Object.keys(CITIES).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label required>Area</Label>
              <select className={inputCls} value={form.area}
                onChange={e => set('area', e.target.value)} disabled={!form.city}>
                <option value="">{form.city ? 'Select area' : 'Select city first'}</option>
                {(CITIES[form.city] ?? []).map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label required>Property Title</Label>
            <input className={inputCls} placeholder="E.g., Luxury 3 Bedroom Apartment in DHA"
              value={form.title} onChange={e => handleTitle(e.target.value)} />
          </div>

          <div>
            <Label required>Slug</Label>
            <input className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
              value={form.slug} readOnly placeholder="auto-generated-from-title" />
          </div>

          <div>
            <Label required>Location / Address</Label>
            <input className={inputCls} placeholder="Enter complete address"
              value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
        </Section>

        {/* ── 2. Map ── */}
        <Section title="Pin Location on Map">
          <div style={{ zIndex: 0, position: 'relative' }}>
            <MapPicker lat={form.lat} lng={form.lng}
              onChange={(lat, lng) => { set('lat', lat); set('lng', lng) }} />
          </div>
          <p className="text-[11px] text-gray-400">
            Click on the map or drag the pin to set exact location.
            {form.lat !== DEFAULT_LAT && (
              <span className="text-[#042C53] font-semibold ml-1">
                📍 {form.lat}, {form.lng}
              </span>
            )}
          </p>
        </Section>

        {/* ── 3. Property Details ── */}
        <Section title="Property Details">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Bedrooms</Label>
              <input type="number" min={0} className={inputCls} value={form.bedrooms}
                onChange={e => set('bedrooms', +e.target.value)} />
            </div>
            <div>
              <Label required>Bathrooms</Label>
              <input type="number" min={0} className={inputCls} value={form.bathrooms}
                onChange={e => set('bathrooms', +e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Marla</Label>
              <input type="number" min={0} step={0.5} className={inputCls} value={form.marla}
                onChange={e => set('marla', +e.target.value)} />
            </div>
            <div>
              <Label>Kanal</Label>
              <input type="number" min={0} step={0.5} className={inputCls} value={form.kanal}
                onChange={e => set('kanal', +e.target.value)} />
            </div>
          </div>
          <div>
            <Label required>Monthly Rent (PKR)</Label>
            <input className={inputCls} placeholder="Enter amount" value={form.price}
              onChange={e => set('price', e.target.value)} />
          </div>
        </Section>

        {/* ── 4. Photos ── */}
        <Section title="Photos">
          <div>
            <Label required>Main Photo</Label>
            {mainPreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <img src={mainPreview} alt="main" className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleMainPhoto(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition">✕</button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[#042C53] transition group">
                <svg width="28" height="28" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24"
                  className="group-hover:stroke-[#042C53] transition">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <p className="text-xs text-gray-400 group-hover:text-[#042C53] font-medium transition">Click to upload main photo</p>
                <p className="text-[11px] text-gray-300">PNG, JPG up to 10MB</p>
                <span className="mt-1 px-4 py-1.5 bg-[#042C53] text-white text-xs rounded-lg font-medium">Select Image</span>
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && handleMainPhoto(e.target.files[0])} />
              </label>
            )}
          </div>
          <div>
            <Label>Additional Photos</Label>
            <div className="flex flex-wrap gap-2">
              {additionalPreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeAdditional(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-600 transition">✕</button>
                </div>
              ))}
              <label className="w-20 h-16 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#042C53] transition group">
                <span className="text-xl text-gray-300 group-hover:text-[#042C53]">+</span>
                <span className="text-[10px] text-gray-300">Add</span>
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={e => e.target.files && handleAdditional(e.target.files)} />
              </label>
            </div>
          </div>
        </Section>

        {/* ── 5. Description ── */}
        <Section title="Property Description">
          <RichEditor value={form.description} onChange={val => set('description', val)}
            placeholder="Describe the property in detail..." />
        </Section>

        {/* ── 6. Features & Amenities ── */}
        <Section title="Features & Amenities">
          <p className="text-xs text-gray-400 -mt-1">Tick the features available in this property — they will appear on the listing page.</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {FEATURES.map(f => {
              const checked = form.features.includes(f.key)
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFeature(f.key)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all text-center cursor-pointer
                    ${checked
                      ? 'border-[#042C53] bg-[#042C53] text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-[#042C53] hover:text-[#042C53]'
                    }`}
                >
                  <span className={checked ? 'text-white' : 'text-gray-400'}>{f.icon}</span>
                  <span className="text-[10px] font-semibold leading-tight">{f.label}</span>
                  {checked && (
                    <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center -mt-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#042C53" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {form.features.length > 0 && (
            <p className="text-[11px] text-[#042C53] font-medium">
              ✓ {form.features.length} feature{form.features.length > 1 ? 's' : ''} selected
            </p>
          )}
        </Section>

        {/* ── 7. Nearby Places ── */}
        <Section title="Nearby Places">
          <p className="text-xs text-gray-400 -mt-1">Add nearby places for each category — these will show on the listing page.</p>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {NEARBY_CATEGORIES.map(cat => (
              <button key={cat} type="button" onClick={() => setActiveNearby(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors border
                  ${activeNearby === cat
                    ? 'bg-[#042C53] text-white border-[#042C53]'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#042C53] hover:text-[#042C53]'
                  }`}>
                {cat}
                {form.nearbyPlaces[cat].length > 0 && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold
                    ${activeNearby === cat ? 'bg-white text-[#042C53]' : 'bg-[#042C53] text-white'}`}>
                    {form.nearbyPlaces[cat].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Items for active category */}
          <div className="space-y-2">
            {form.nearbyPlaces[activeNearby].length === 0 && (
              <p className="text-xs text-gray-300 py-2">No {activeNearby} added yet.</p>
            )}
            {form.nearbyPlaces[activeNearby].map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder={`${activeNearby.slice(0, -1)} name (e.g., Beaconhouse)`}
                  value={item.name}
                  onChange={e => updateNearbyItem(activeNearby, i, 'name', e.target.value)}
                />
                <input
                  className="w-28 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#042C53] focus:ring-1 focus:ring-[#042C53] transition"
                  placeholder="~3 min"
                  value={item.time}
                  onChange={e => updateNearbyItem(activeNearby, i, 'time', e.target.value)}
                />
                <button type="button" onClick={() => removeNearbyItem(activeNearby, i)}
                  className="text-gray-300 hover:text-red-400 transition text-lg px-1 shrink-0">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => addNearbyItem(activeNearby)}
              className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-200 rounded-lg py-2 text-xs text-gray-400 hover:border-[#042C53] hover:text-[#042C53] transition">
              <span className="text-base leading-none">+</span> Add {activeNearby.slice(0, -1)}
            </button>
          </div>
        </Section>

        {/* ── 8. Media ── */}
        <Section title="Media">
          <div>
            <Label>YouTube Video URL <span className="text-gray-300 font-normal text-[11px]">(Optional)</span></Label>
            <input className={inputCls} placeholder="https://www.youtube.com/watch?v=..."
              value={form.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)} />
          </div>
        </Section>

        {/* ── 9. Contact ── */}
        <Section title="Contact Details">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Contact Number</Label>
              <input className={inputCls} placeholder="03XX XXXXXXX"
                value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} />
            </div>
            <div>
              <Label>WhatsApp Number <span className="text-gray-300 font-normal text-[11px]">(Optional)</span></Label>
              <input className={inputCls} placeholder="923XX XXXXXXX"
                value={form.whatsappNumber} onChange={e => set('whatsappNumber', e.target.value)} />
              <p className="text-[11px] text-gray-400 mt-1">If empty, contact number will be used.</p>
            </div>
          </div>
        </Section>

        {/* ── 10. SEO ── */}
        <Section title="SEO Settings">
          <div>
            <Label>Meta Title</Label>
            <input className={inputCls} placeholder="SEO title (auto-filled from property title)"
              value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
            <div className="flex justify-between mt-1">
              <p className="text-[11px] text-gray-400">Recommended: 50–60 characters</p>
              <p className={`text-[11px] font-medium ${form.metaTitle.length > 60 ? 'text-red-400' : 'text-gray-400'}`}>
                {form.metaTitle.length}/60
              </p>
            </div>
          </div>
          <div>
            <Label>Meta Description</Label>
            <textarea rows={2} className={`${inputCls} resize-none`}
              placeholder="Short description for search engines (max 160 characters)"
              value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
            <div className="flex justify-between mt-1">
              <p className="text-[11px] text-gray-400">Recommended: 120–160 characters</p>
              <p className={`text-[11px] font-medium ${form.metaDescription.length > 160 ? 'text-red-400' : 'text-gray-400'}`}>
                {form.metaDescription.length}/160
              </p>
            </div>
          </div>
        </Section>

        {/* ── Submit ── */}
        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={submitting}
            className="flex-1 bg-[#042C53] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#063a6e] disabled:opacity-60 transition">
            {submitting ? 'Publishing...' : 'Publish Property'}
          </button>
          <a href="/admin/properties"
            className="px-8 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
            Cancel
          </a>
        </div>

      </form>
    </div>
  )
}