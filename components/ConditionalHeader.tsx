'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from './Header'

function AdminHeaderInfo() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check')
      const result = await response.json()
      if (result.success) {
        setUser(result.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600">Welcome, {user.email}</span>
      <button
        onClick={() => {
          document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          router.push('/login')
        }}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Logout
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
  
  // Show company name and admin info on admin page
  if (pathname === '/admin') {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-4xl font-bold">
              <span className="text-gray-900">learn</span><span className="text-blue-600">techlab</span>
            </div>
            <AdminHeaderInfo />
          </div>
        </div>
      </header>
    )
  }
  
  // Show only company name on student page
  if (pathname === '/student') {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-4xl font-bold">
              <span className="text-gray-900">learn</span><span className="text-blue-600">techlab</span>
            </div>
          </div>
        </div>
      </header>
    )
  }
  
  return <Header />
}