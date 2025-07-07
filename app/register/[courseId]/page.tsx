import { getCourseById } from '@/data/courses'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import CognitoRegistration from '@/components/CognitoRegistration'

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
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <Link
              href={`/courses/${course.id}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course Details
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
              Register for {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>Duration: {course.duration}</span>
              <span>•</span>
              <span>Price: ₹{course.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="registration-wrapper">
            <CognitoRegistration 
              courseId={course.id}
              courseName={course.title}
              coursePrice={course.price}
            />
          </div>
        </div>
      </div>
    </div>
  )
}