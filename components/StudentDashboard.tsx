'use client'
import { useState, useEffect } from 'react'
import { useStudentAuth } from '@/contexts/StudentAuthContext'
import { BookOpen, LogOut, User, Award } from 'lucide-react'
import Link from 'next/link'

interface CourseProgress {
  courseId: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
}

export default function StudentDashboard() {
  const { user, signOut } = useStudentAuth()
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({})
  const [courseNames, setCourseNames] = useState<Record<string, string>>({})
  const [loadingProgress, setLoadingProgress] = useState(true)

  useEffect(() => {
    if (user?.enrolledCourses) {
      fetchCourseNames()
      fetchProgressData()
    }
  }, [user])

  const fetchCourseNames = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      if (data.success) {
        const names: Record<string, string> = {}
        data.courses.forEach((course: any) => {
          names[course.courseId] = course.title
        })
        setCourseNames(names)
      }
    } catch (error) {
      console.error('Error fetching course names:', error)
    }
  }

  const fetchProgressData = async () => {
    if (!user?.enrolledCourses) return
    
    try {
      const progressData: Record<string, CourseProgress> = {}
      
      for (const courseId of user.enrolledCourses) {
        const response = await fetch(`/api/student/progress?email=${user.email}&courseId=${courseId}&t=${Date.now()}&r=${Math.random()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        const data = await response.json()
        
        if (data.success) {
          progressData[courseId] = data.progress
        }
      }
      
      setCourseProgress(progressData)
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoadingProgress(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/student" className="text-2xl font-bold">
                <span className="text-gray-900">learn</span><span className="text-blue-600">techlab</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! Continue your learning journey
          </h2>
          <p className="text-gray-600">Access your courses, track progress, and achieve your goals</p>
        </div>

        {/* Enrolled Courses */}
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </h3>
            
            {user?.enrolledCourses && user.enrolledCourses.length > 0 ? (
              <div className="grid gap-4">
                {loadingProgress && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading progress...</p>
                  </div>
                )}
                {user.enrolledCourses.map((courseId) => {
                  const progressData = courseProgress[courseId]
                  const progress = progressData?.progressPercentage || 0
                  const completedLessons = progressData?.completedLessons || 0
                  const totalLessons = progressData?.totalLessons || 0
                  
                  return (
                    <div key={courseId} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {courseNames[courseId] || courseId}
                          </h4>
                          <p className="text-gray-600 text-sm">{completedLessons} of {totalLessons} materials completed</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            progress === 0 ? 'bg-gray-100 text-gray-800' :
                            progress < 50 ? 'bg-yellow-100 text-yellow-800' :
                            progress < 100 ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {progress === 0 ? 'Not Started' :
                             progress < 100 ? 'In Progress' : 'Completed'}
                          </span>
                          <Link
                            href={`/student/course/${courseId}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            {progress === 0 ? 'Start' : 'Continue'}
                          </Link>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progress === 0 ? 'bg-gray-400' :
                              progress < 50 ? 'bg-yellow-500' :
                              progress < 100 ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h4>
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                <a
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  <BookOpen className="h-4 w-4" />
                  Browse Courses
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}