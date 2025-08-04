'use client'

interface LMSLogoProps {
  className?: string
}

export default function LMSLogo({ className = "" }: LMSLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold">
        <span className="text-gray-900">learn</span>
        <span className="text-blue-600">techlab</span>
        <span className="text-gray-700 ml-2 text-lg font-medium">LMS</span>
      </span>
    </div>
  )
}