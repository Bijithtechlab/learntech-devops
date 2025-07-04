import Link from 'next/link'
import { Course } from '@/data/courses'
import { Clock, Users, Award } from 'lucide-react'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {course.title}
          </h3>
          {course.status === 'coming-soon' && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-grow">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.level}
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            {course.category}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-2xl font-bold text-blue-600">
            ₹{course.price.toLocaleString()}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/courses/${course.id}`}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              View Details
            </Link>
            {course.status === 'active' && (
              <Link
                href={`/register/${course.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}