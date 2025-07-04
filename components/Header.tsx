import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-4xl font-bold">
            <span className="text-gray-900">learn</span><span className="text-blue-600">techlab</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">
              Courses
            </Link>
            <Link href="/trainers" className="text-gray-700 hover:text-blue-600 font-medium">
              Trainers
            </Link>
            <Link href="/student" className="text-gray-700 hover:text-blue-600 font-medium">
              Student Portal
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}