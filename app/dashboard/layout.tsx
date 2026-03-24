 import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import DashboardHeader from '../components/dashboard/DashboardHeader'

export const metadata = { title: 'Dashboard — RentGhars' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}