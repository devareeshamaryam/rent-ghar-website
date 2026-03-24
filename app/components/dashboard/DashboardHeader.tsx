 'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':               'Dashboard',
  '/dashboard/my-properties': 'My Listings',
  '/dashboard/subscription':  'My Subscription',
  '/dashboard/messages':      'Inbox',
  '/dashboard/settings':      'Settings',
}

export default function DashboardHeader() {
  const pathname = usePathname()
  const title    = PAGE_TITLES[pathname] || 'Dashboard'

  const btnCls = "flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition px-3 py-1.5 rounded-lg hover:bg-gray-50 border border-gray-200"

  return (
    <header className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-20">

      <p className="text-sm font-semibold text-gray-700">{title}</p>

      <div className="flex items-center gap-2">

        <Link href="/" target="_blank" className={btnCls}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Go to Website
        </Link>

        <Link href="/dashboard/my-properties" className={btnCls}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          My Listings
        </Link>

        <Link href="/admin/properties/add" className={btnCls}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Post Listing
        </Link>

        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>

      </div>
    </header>
  )
}