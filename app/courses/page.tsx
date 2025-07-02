import Link from 'next/link'
import { Clock, Users, Award } from 'lucide-react'
import CourseDetails from '@/components/CourseDetails'

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">AI Powered SW Development, DevOps & Cloud: The Future-Ready Engineer</h1>
          <p className="text-xl opacity-90">
            Comprehensive 25-section curriculum covering AI-Powered Software Development, DevOps, Cloud, Containers, and Full-Stack Development
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Clock className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Duration</h3>
            <p className="text-gray-600">8 months intensive program</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Users className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Batch Size</h3>
            <p className="text-gray-600">Maximum 20 students per batch</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Award className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Certification</h3>
            <p className="text-gray-600">Industry-recognized certificate</p>
          </div>
        </div>

        <CourseDetails />

        <div className="bg-white p-8 rounded-lg shadow-sm mt-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-600 mb-6">
            Master AI-Powered Software Development, DevOps, AWS Cloud, Kubernetes, Docker, CI/CD, and Full-Stack development with hands-on projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Enroll Now - ₹14,999
            </Link>
            <Link 
              href="/" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}