 'use client'

// app/admin/page.tsx
// Admin dashboard — sab registered users + stats dikhata hai

import { useState, useEffect } from 'react'

interface AdminStats {
  totalUsers:  number
  activeUsers: number
}

interface User {
  _id:       string
  name:      string
  email:     string
  phone:     string
  isActive:  boolean
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30)  return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

const statCards = (stats: AdminStats) => [
  {
    label:  'Total Users',
    value:  stats.totalUsers,
    accent: 'border-[#042C53]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#042C53" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label:  'Active Users',
    value:  stats.activeUsers,
    accent: 'border-green-500',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    label:  'Inactive Users',
    value:  stats.totalUsers - stats.activeUsers,
    accent: 'border-red-400',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
  {
    label:  'Total Properties',
    value:  0,
    accent: 'border-amber-500',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
]

const quickActions = [
  { label: 'Add Property', href: '/admin/properties/add', color: 'bg-[#042C53] text-white hover:bg-[#063a6e]' },
  { label: 'Add City',     href: '/admin/cities/add',     color: 'bg-amber-500 text-white hover:bg-amber-600' },
  { label: 'Add Area',     href: '/admin/areas/add',      color: 'bg-[#042C53] text-white hover:bg-[#063a6e]' },
  { label: 'Add Type',     href: '/admin/types/add',      color: 'bg-amber-500 text-white hover:bg-amber-600' },
]

export default function AdminDashboard() {
  const [users,   setUsers]   = useState<User[]>([])
  const [stats,   setStats]   = useState<AdminStats>({ totalUsers: 0, activeUsers: 0 })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setUsers(d.data   || [])
          setStats(d.stats  || { totalUsers: 0, activeUsers: 0 })
        } else {
          setError(d.message || 'Failed to load users')
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back, Admin — here's your platform overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {statCards(stats).map(stat => (
          <div key={stat.label} className={`bg-white rounded-xl p-5 border-t-4 ${stat.accent} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(action => (
            <a key={action.label} href={action.href}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${action.color}`}>
              + {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* All Registered Users */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">All Registered Users</h2>
          <span className="text-xs text-gray-400">{stats.totalUsers} total</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading users...</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-400">{error}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">No users registered yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-medium">Name</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Phone</th>
                  <th className="px-6 py-3 text-left font-medium">Joined</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#042C53] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{user.email}</td>
                    <td className="px-6 py-3 text-gray-500">{user.phone || '—'}</td>
                    <td className="px-6 py-3 text-gray-400 text-xs">{timeAgo(user.createdAt)}</td>
                    <td className="px-6 py-3">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                        user.isActive
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}