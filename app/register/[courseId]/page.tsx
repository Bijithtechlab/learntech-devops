import { getCourseById } from '@/data/courses'
import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'
import { notFound } from 'next/navigation'

interface RegisterPageProps {
  params: {
    courseId: string
  }
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const course = getCourseById(params.courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <Construction className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registration System Under Development
            </h1>
            <p className="text-xl text-gray-600">
              Course registration for <span className="font-semibold text-blue-600">{course.title}</span> is currently being enhanced
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🚀 What's Being Developed
            </h2>
            <ul className="text-blue-800 space-y-2 text-left">
              <li>• Enhanced email verification system</li>
              <li>• Automated course enrollment process</li>
              <li>• Real-time payment integration</li>
              <li>• Instant course access upon registration</li>
              <li>• Mobile-optimized registration experience</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              📧 Register Now via Email
            </h2>
            <p className="text-green-800 mb-4">
              For immediate course registration, please contact us directly:
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-green-900">
                📧 Email: <a href="mailto:info@learntechlab.com?subject=Course Registration - {course.title}" className="text-blue-600 hover:underline">info@learntechlab.com</a>
              </p>
              <p className="text-green-800">
                Include the course name: <span className="font-semibold">{course.title}</span>
              </p>
              <p className="text-sm text-green-700 mt-3">
                💰 Course Fee: <span className="font-semibold">₹{course.price.toLocaleString()}</span> | ⏱️ Duration: <span className="font-semibold">{course.duration}</span>
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              <strong>⏰ Expected Launch:</strong> Online registration system will be available within 24-48 hours. We're currently waiting for AWS email service approval to enable automated registrations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/courses/${course.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course Details
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Courses
            </Link>
            <a
              href={`mailto:info@learntechlab.com?subject=Course Registration - ${course.title}&body=Hi,%0D%0A%0D%0AI would like to register for the ${course.title} course.%0D%0A%0D%0ACourse Details:%0D%0A- Course: ${course.title}%0D%0A- Duration: ${course.duration}%0D%0A- Price: ₹${course.price.toLocaleString()}%0D%0A%0D%0APlease provide me with the registration process and payment details.%0D%0A%0D%0AThank you!`}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📧 Register via Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}