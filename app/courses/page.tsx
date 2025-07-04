import { courses } from '@/data/courses'
import CourseCard from '@/components/CourseCard'

export default function CoursesPage() {
  const activeCourses = courses.filter(course => course.status === 'active')
  const comingSoonCourses = courses.filter(course => course.status === 'coming-soon')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of technology and management courses designed to advance your career
          </p>
        </div>

        {activeCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Now</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {comingSoonCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}