import Link from 'next/link'
import { Construction, ArrowLeft, BookOpen, Video, Award } from 'lucide-react'

export default function StudentPortalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <Construction className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Portal Coming Soon
            </h1>
            <p className="text-xl text-gray-600">
              Our comprehensive student learning portal is under development
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              Upcoming Features
            </h2>
            <div className="grid gap-4">
              <div className="flex items-center gap-3 text-blue-800">
                <Video className="h-5 w-5" />
                <span>Access to course videos and materials</span>
              </div>
              <div className="flex items-center gap-3 text-blue-800">
                <BookOpen className="h-5 w-5" />
                <span>Interactive assignments and quizzes</span>
              </div>
              <div className="flex items-center gap-3 text-blue-800">
                <Award className="h-5 w-5" />
                <span>Progress tracking and certificates</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              Current Students
            </h2>
            <p className="text-green-800 mb-4">
              If you're already enrolled, please contact us for course materials:
            </p>
            <p className="font-semibold text-green-900">
              📧 Email: <a href="mailto:info@learntechlab.com" className="text-blue-600 hover:underline">info@learntechlab.com</a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}