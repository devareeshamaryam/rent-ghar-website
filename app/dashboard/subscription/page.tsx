 'use client'

import { useState } from 'react'

const PACKAGES = [
  {
    id:       'free',
    name:     'Free',
    tagline:  'For individuals',
    price:    0,
    duration: 30,
    listings: 1,
    featured: 0,
    photos:   5,
    features: ['1 property listing', '5 photos per property', '30 days validity'],
    popular:  false,
  },
  {
    id:       'standard',
    name:     'Standard',
    tagline:  'For small owners',
    price:    2999,
    duration: 30,
    listings: 5,
    featured: 1,
    photos:   10,
    features: ['5 property listings', '1 featured listing', '10 photos per property', '30 days validity', 'Priority support'],
    popular:  true,
  },
  {
    id:       'premium',
    name:     'Premium',
    tagline:  'For professionals',
    price:    7999,
    duration: 30,
    listings: 15,
    featured: 3,
    photos:   15,
    features: ['15 property listings', '3 featured listings', '15 photos per property', '30 days validity', 'Premium badge', 'Priority support', 'Premium placement'],
    popular:  false,
  },
  {
    id:       'enterprise',
    name:     'Enterprise',
    tagline:  'For large agencies',
    price:    19999,
    duration: 90,
    listings: 50,
    featured: 10,
    photos:   20,
    features: ['50 property listings', '10 featured listings', '20 photos per property', '90 days validity', 'Enterprise badge', 'Dedicated support', 'Premium placement', 'Analytics dashboard'],
    popular:  false,
  },
]

const Check = () => (
  <svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function SubscriptionPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const activeSub = null

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">My Subscription</h1>
        <p className="text-xs text-gray-400 mt-1">Manage your subscription and view usage details</p>
      </div>

      {/* No active sub banner */}
      {!activeSub && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between mb-7 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center">
              <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">No Active Subscription</p>
              <p className="text-xs text-gray-400">Purchase a package to start listing your properties</p>
            </div>
          </div>
        </div>
      )}

      {/* Packages */}
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Choose a Plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {PACKAGES.map(pkg => {
          const isSelected = selected === pkg.id
          return (
            <div key={pkg.id}
              onClick={() => setSelected(isSelected ? null : pkg.id)}
              className={`relative bg-white rounded-xl border-2 cursor-pointer transition-all
                ${isSelected
                  ? 'border-[#042C53] shadow-md'
                  : pkg.popular
                    ? 'border-gray-800'
                    : 'border-gray-100 hover:border-gray-300 shadow-sm'
                }`}>

              {/* Popular badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="p-5">
                {/* Plan name + tagline */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-gray-900">{pkg.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{pkg.tagline}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-gray-100">
                  <span className="text-2xl font-bold text-gray-900">
                    Rs. {pkg.price === 0 ? '0' : pkg.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400">/ {pkg.duration}d</span>
                </div>

                {/* Key stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center bg-gray-50 rounded-lg py-2">
                    <p className="text-base font-bold text-[#042C53]">{pkg.listings}</p>
                    <p className="text-[9px] text-gray-400 font-medium">Listings</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg py-2">
                    <p className="text-base font-bold text-[#042C53]">{pkg.featured}</p>
                    <p className="text-[9px] text-gray-400 font-medium">Featured</p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg py-2">
                    <p className="text-base font-bold text-[#042C53]">{pkg.photos}</p>
                    <p className="text-[9px] text-gray-400 font-medium">Photos</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-5">
                  {pkg.features.map(f => (
                    <div key={f} className="flex items-start gap-2">
                      <Check />
                      <span className="text-[11px] text-gray-500 leading-tight">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition
                    ${isSelected
                      ? 'bg-[#042C53] text-white'
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                    }`}>
                  {isSelected ? '✓ Selected' : 'Get Started'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Proceed banner */}
      {selected && (
        <div className="bg-[#042C53] rounded-xl p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-white font-semibold text-sm">
              {PACKAGES.find(p => p.id === selected)?.name} Plan Selected
            </p>
            <p className="text-blue-200 text-xs mt-0.5">
              Rs. {PACKAGES.find(p => p.id === selected)?.price.toLocaleString()} · {PACKAGES.find(p => p.id === selected)?.duration} days validity
            </p>
          </div>
          <button className="bg-amber-400 text-[#042C53] px-5 py-2 rounded-lg text-xs font-bold hover:bg-amber-300 transition shrink-0">
            Proceed to Payment
          </button>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Subscription History</h2>
        </div>
        <div className="py-10 text-center text-xs text-gray-400">
          No subscription history
        </div>
      </div>

    </div>
  )
}