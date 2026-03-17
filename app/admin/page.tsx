interface StatCard {
  label: string
  value: string
  icon: React.ReactNode
  accent: string
}

const stats: StatCard[] = [
  {
    label: 'Total Properties',
    value: '0',
    accent: 'border-[#042C53]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#042C53" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Total Cities',
    value: '0',
    accent: 'border-amber-500',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Total Areas',
    value: '0',
    accent: 'border-[#042C53]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#042C53" strokeWidth="1.8">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    label: 'Active Subscriptions',
    value: '0',
    accent: 'border-amber-500',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
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
  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-xl p-5 border-t-4 ${stat.accent} shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {stat.label}
              </p>
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
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${action.color}`}
            >
              + {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Recent Properties</h2>
        <div className="text-center py-12 text-gray-300">
          <svg className="w-10 h-10 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <p className="text-sm">No properties added yet</p>
        </div>
      </div>

    </div>
  )
}