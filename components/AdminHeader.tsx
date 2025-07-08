'use client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminHeader() {
  const router = useRouter()

  const handleSignOut = () => {
    // Clear any admin session/tokens
    localStorage.removeItem('adminToken')
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">LearnTechLab</h1>
            <span className="ml-2 text-sm text-gray-500">Admin Portal</span>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}