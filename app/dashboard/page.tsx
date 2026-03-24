 'use client'

// app/dashboard/page.tsx
// User dashboard — sirf apna data dikhata hai

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserInfo {
  id:    string
  name:  string
  email: string
  role:  string
  phone: string
}

interface Property {
  _id:       string
  title:     string
  price:     number
  status:    string
  mainPhoto: string
  city:      { name: string }
  area:      { name: string }
  views:     number
  createdAt: string
}

interface Stats {
  total:  number
  active: number
  views:  number
}

function formatPrice(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000)   return `${(n / 100000).toFixed(1)} Lac`
  return n.toLocaleString()
}

const STATUS_COLORS: Record<string, string> = {
  active:   'bg-green-50 text-green-600',
  pending:  'bg-amber-50 text-amber-600',
  rejected: 'bg-red-50 text-red-500',
  expired:  'bg-gray-100 text-gray-400',
}

export default function DashboardPage() {
  const [user,       setUser]       = useState<UserInfo | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [stats,      setStats]      = useState<Stats>({ total: 0, active: 0, views: 0 })
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Logged in user info
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (meData.success) setUser(meData.user)

        // Sirf is user ki properties
        const propRes = await fetch('/api/user/properties?limit=5')
        const propData = await propRes.json()
        if (propData.success) {
          setProperties(propData.data || [])
          setStats(propData.stats || { total: 0, active: 0, views: 0 })
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">
          Welcome back, <span className="font-semibold text-gray-600">{user?.name || 'User'}</span>!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Properties', value: stats.total,  color: 'border-t-[#042C53]' },
          { label: 'Active Listings',  value: stats.active, color: 'border-t-green-500'  },
          { label: 'Total Views',      value: stats.views,  color: 'border-t-amber-500'  },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-xl p-4 border-t-4 ${s.color} shadow-sm`}>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Subscription Banner */}
      <div className="bg-gradient-to-r from-[#042C53] to-[#063a6e] rounded-xl p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm">No Active Subscription</p>
          <p className="text-blue-200 text-xs mt-1">Purchase a package to start listing your properties</p>
        </div>
        <Link href="/dashboard/subscription"
          className="bg-amber-400 text-[#042C53] px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-300 transition shrink-0">
          View Packages
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">My Recent Properties</h2>
          <Link href="/dashboard/my-properties"
            className="text-xs text-[#042C53] font-semibold hover:underline">
            View all
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-10 h-10 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <p className="text-gray-400 text-sm mb-2">No properties yet</p>
            <Link href="/dashboard/subscription"
              className="text-xs text-[#042C53] font-semibold underline">
              Get a subscription to start listing
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {properties.map((p: any) => (
              <div key={p._id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
                <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {p.mainPhoto
                    ? <img src={p.mainPhoto} alt={p.title} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full bg-gray-100"/>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400">{p.area?.name}, {p.city?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-[#042C53]">PKR {formatPrice(p.price)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-400'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}