 'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  {
    href:  '/dashboard',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href:  '/admin/properties/add',
    label: 'Post Listing',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    href:  '/dashboard/my-properties',
    label: 'My Listings',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href:  '/dashboard/subscription',
    label: 'Subscription',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    href:  '/dashboard/messages',
    label: 'Inbox',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    href:  '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
]

export default function DashboardSidebar() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(true)

  return (
    <aside className={`${open ? 'w-52' : 'w-14'} min-h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-200 sticky top-0 z-30`}>

      {/* Top — logo + hamburger */}
      <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100">
        <button onClick={() => setOpen(o => !o)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition shrink-0">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        {open && (
          <Link href="/" className="flex items-center gap-2">
            
            <span className="text-sm font-bold text-gray-900 whitespace-nowrap">RentGhars</span>
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-hidden">
        {navItems.map(item => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 mx-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors mb-0.5
                ${active
                  ? 'bg-[#eef2f8] text-[#042C53] font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}>
              <span className={`shrink-0 ${active ? 'text-[#042C53]' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              {open && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-2">
        <button className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className="shrink-0">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}