import Link from 'next/link'
import { getActiveCourses } from '@/data/courses'
import CourseCard from './CourseCard'

export default function FeaturedCourses() {
  const activeCourses = getActiveCourses().slice(0, 3) // Show first 3 active courses

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Featured Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of technology and management courses designed to advance your career
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activeCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  )
}