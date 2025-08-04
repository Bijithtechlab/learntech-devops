'use client'
import { useState, useEffect } from 'react'
import CourseCard from '@/components/CourseCard'

interface Course {
  courseId: string
  title: string
  shortTitle: string
  description: string
  duration: string
  price: number
  level: string
  category: string
  features: string[]
  status: 'active' | 'coming-soon'
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeCourses = courses.filter(course => course.status === 'active')
  const comingSoonCourses = courses.filter(course => course.status === 'coming-soon')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 px-4">
            Our Courses
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Choose from our comprehensive range of technology and management courses designed to advance your career
          </p>
        </div>

        {activeCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course) => (
                <CourseCard key={course.courseId} course={{...course, id: course.courseId}} />
              ))}
            </div>
          </div>
        )}

        {comingSoonCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonCourses.map((course) => (
                <CourseCard key={course.courseId} course={{...course, id: course.courseId}} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}