'use client'
import { useState } from 'react'
import { getCourseById } from '@/data/courses'
import { aiDevOpsSyllabus } from '@/data/syllabus'
import Link from 'next/link'
import { Clock, Users, Award, CheckCircle, BookOpen, Star } from 'lucide-react'
import { notFound } from 'next/navigation'
import SyllabusModal from '@/components/SyllabusModal'

interface CourseDetailPageProps {
  params: {
    courseId: string
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const [showSyllabus, setShowSyllabus] = useState(false)
  const course = getCourseById(params.courseId)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{course.title}</h1>
              {course.status === 'coming-soon' && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Coming Soon
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm sm:text-base">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm sm:text-base">{course.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="text-sm sm:text-base">{course.category}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2 min-w-0">
              <h2 className="text-xl font-semibold mb-4">Course Description</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
              <ul className="space-y-3 mb-6">
                {course.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {course.id === 'ai-devops-cloud' && (
                <>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 sm:p-6 mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="h-6 w-6 text-yellow-600" />
                      <h3 className="text-xl font-bold text-yellow-800">🎯 Exclusive Internship Opportunity!</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      This course makes you <strong>eligible for our highly selective internship program!</strong> Get real-world experience and direct pathway to employment.
                    </p>
                    <Link
                      href="/internship"
                      className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                    >
                      <Star className="h-5 w-5" />
                      View Internship Details
                    </Link>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => setShowSyllabus(true)}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <BookOpen className="h-5 w-5" />
                      View Detailed Syllabus
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="md:col-span-1 min-w-0">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:sticky md:top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ₹{course.price.toLocaleString()}
                  </div>
                  <p className="text-gray-600">One-time payment</p>
                </div>

                <div className="space-y-3">
                  {course.status === 'active' ? (
                    <Link
                      href={`/register/${course.id}`}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                    >
                      Register Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                  
                  <Link
                    href="/courses"
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center block"
                  >
                    View All Courses
                  </Link>
                </div>

                {course.id === 'ai-devops-cloud' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Course Schedule</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div>
                        <span className="font-medium">Mode:</span>
                        <span className="ml-1">Online Classes</span>
                      </div>
                      <div>
                        <span className="font-medium">Days:</span>
                        <span className="ml-1">Mon, Wed, Thu, Fri</span>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <span className="ml-1">04:30-06:30 PM IST</span>
                      </div>
                      <div>
                        <span className="font-medium">Start:</span>
                        <span className="ml-1">04-Aug-2025</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {course.id === 'ai-devops-cloud' && (
          <SyllabusModal
            isOpen={showSyllabus}
            onClose={() => setShowSyllabus(false)}
            syllabus={aiDevOpsSyllabus}
            courseTitle={course.title}
          />
        )}
      </div>
    </div>
  )
}