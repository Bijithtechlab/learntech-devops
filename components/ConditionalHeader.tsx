'use client'
import { usePathname } from 'next/navigation'
import Header from './Header'
import { useUser } from '@/contexts/UserContext'

function UserHeaderInfo() {
  const { user, logout } = useUser()

  if (!user) return null

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600">Welcome, {user.name}</span>
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Hide header completely on login page
  if (pathname === '/login') {
    return null
  }
  
  const { user } = useUser()
  
  // Show user header for logged in users
  if (user) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-4xl font-bold">
              <span className="text-gray-900">learn</span><span className="text-blue-600">techlab</span>
            </div>
            <UserHeaderInfo />
          </div>
        </div>
      </header>
    )
  }
  
  return <Header />
}