'use client'
import LMSLogo from './LMSLogo'

interface AdminHeaderProps {
  title: string
  children?: React.ReactNode
}

export default function AdminHeader({ title, children }: AdminHeaderProps) {
  const handleLogout = () => {
    window.location.href = '/login'
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <LMSLogo />
        <span className="text-gray-400">|</span>
        <h1 className="text-2xl font-semibold text-gray-700">{title.replace('LearnTechLab LMS - ', '')}</h1>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Welcome, Admin</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}