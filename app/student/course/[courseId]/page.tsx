'use client'
import { useState, useEffect } from 'react'
import { StudentAuthProvider, useStudentAuth } from '@/contexts/StudentAuthContext'
import { getCourseMaterials, CourseSection } from '@/data/courseMaterials'
import { ArrowLeft, FileText, HelpCircle, Lock, Clock, CheckCircle, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface CourseContentPageProps {
  params: {
    courseId: string
  }
}

function CourseContentPageContent({ params }: CourseContentPageProps) {
  const { user } = useStudentAuth()
  const [courseSections, setCourseSections] = useState<CourseSection[]>([])
  const [courseTitle, setCourseTitle] = useState<string>('')
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set())
  const [quizAttempts, setQuizAttempts] = useState<{[key: string]: {attempts: number, lastScore: number, passed: boolean}}>({})
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [paymentError, setPaymentError] = useState<string | null>(null)


  useEffect(() => {
    if (user && params.courseId) {
      // Check if user is enrolled in this course
      if (!user.enrolledCourses.includes(params.courseId)) {
        return
      }
      
      checkPaymentAndFetchMaterials()
    }
  }, [user, params.courseId])

  const checkPaymentAndFetchMaterials = async () => {
    await fetchCourseTitle()
    await fetchCourseMaterials()
    await fetchCompletedMaterials()
    await fetchQuizAttempts()
  }

  const fetchCompletedMaterials = async () => {
    if (!user?.email) return
    
    try {
      const response = await fetch(`/api/student/progress?email=${user.email}&courseId=${params.courseId}`)
      const data = await response.json()
      if (data.success) {
        setCompletedMaterials(new Set(data.completedMaterials))
      }
    } catch (error) {
      console.error('Error fetching completed materials:', error)
    }
  }

  const fetchQuizAttempts = async () => {
    if (!user?.email) return
    
    try {
      const response = await fetch(`/api/student/quiz-attempts?email=${user.email}&courseId=${params.courseId}&t=${Date.now()}&r=${Math.random()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      if (data.success) {
        const attemptsMap: {[key: string]: {attempts: number, lastScore: number, passed: boolean}} = {}
        
        // Group attempts by quizId
        const groupedAttempts: {[key: string]: any[]} = {}
        data.quizAttempts.forEach((attempt: any) => {
          if (!groupedAttempts[attempt.quizId]) {
            groupedAttempts[attempt.quizId] = []
          }
          groupedAttempts[attempt.quizId].push(attempt)
        })
        
        // For each quiz, get the latest attempt
        Object.keys(groupedAttempts).forEach(quizId => {
          const attempts = groupedAttempts[quizId]
          // Sort by attemptedAt to get the latest
          attempts.sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())
          const latestAttempt = attempts[0]
          
          attemptsMap[quizId] = {
            attempts: attempts.length,
            lastScore: latestAttempt.score,
            passed: latestAttempt.passed
          }
        })
        
        setQuizAttempts(attemptsMap)
      }
    } catch (error) {
      console.error('Error fetching quiz attempts:', error)
    }
  }

  const isSubSectionCompleted = (subSection: any) => {
    if (!subSection.materials || subSection.materials.length === 0) return false
    return subSection.materials.every((material: any) => completedMaterials.has(material.id))
  }

  const isSectionCompleted = (section: any) => {
    if (!section.subSections || section.subSections.length === 0) return false
    return section.subSections.every((subSection: any) => isSubSectionCompleted(subSection))
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const fetchCourseTitle = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      if (data.success) {
        const course = data.courses.find((c: any) => c.courseId === params.courseId)
        if (course) {
          setCourseTitle(course.title)
        }
      }
    } catch (error) {
      console.error('Error fetching course title:', error)
    }
  }

  const fetchCourseMaterials = async () => {
    try {
      const response = await fetch(`/api/student/materials?courseId=${params.courseId}`)
      const data = await response.json()
      
      if (data.success) {
        setCourseSections(data.sections)
      } else {
        console.error('Failed to fetch materials:', data.message)
        // Fallback to static data
        const materials = getCourseMaterials(params.courseId)
        setCourseSections(materials)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
      // Fallback to static data
      const materials = getCourseMaterials(params.courseId)
      setCourseSections(materials)
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

  if (paymentError) {
    const getErrorMessage = () => {
      switch (paymentError) {
        case 'PAYMENT_PENDING':
          return {
            title: 'Payment Processing',
            message: 'Your payment is being processed. Please contact info@learntechlab.com for assistance.'
          }
        case 'PAYMENT_REQUIRED':
          return {
            title: 'Payment Required',
            message: 'Your payment is required to access course materials. Please contact info@learntechlab.com.'
          }
        default:
          return {
            title: 'Access Denied',
            message: 'Please contact info@learntechlab.com for assistance.'
          }
      }
    }
    
    const errorInfo = getErrorMessage()
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{errorInfo.title}</h1>
          <p className="text-gray-600 mb-4">{errorInfo.message}</p>
          <div className="space-y-2">
            <a href="mailto:info@learntechlab.com" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Contact Support
            </a>
            <Link href="/student" className="block text-blue-600 hover:text-blue-700">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!user?.enrolledCourses.includes(params.courseId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You are not enrolled in this course.</p>
          <Link href="/student" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const displayTitle = courseTitle || params.courseId

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/student" className="text-xl font-bold">
                <span className="text-gray-900">learn</span><span className="text-blue-600">techlab</span>
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <Link 
                  href="/student"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Link>
              </div>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900">{displayTitle}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
              </div>
              <button
                onClick={async () => {
                  const { signOut } = await import('aws-amplify/auth')
                  await signOut()
                  window.location.href = '/student'
                }}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Materials</h2>
          <p className="text-gray-600">Access your learning materials and track your progress</p>
        </div>

        {/* Course Sections */}
        <div className="space-y-6">
          {courseSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border">
              <div 
                className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        expandedSections.has(section.id) ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        {section.title}
                        {isSectionCompleted(section) && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </h3>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded ${
                    isSectionCompleted(section) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isSectionCompleted(section) ? 'Section Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
              
              {expandedSections.has(section.id) && (
                <div className="p-6">
                  <div className="space-y-3">
                    {section.subSections?.map((subSection) => (
                      <div key={subSection.id}>
                        {/* Subsection Materials in Single Row */}
                        {subSection.materials?.map((material) => (
                          <div key={material.id} className="flex items-center justify-between py-3 pl-6 hover:bg-gray-50 rounded border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center gap-4 flex-1">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="font-medium text-gray-900 min-w-[200px]">{subSection.title}</span>
                              <span className="text-gray-700">{material.title}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">PDF</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs px-2 py-1 rounded ${
                                completedMaterials.has(material.id) 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {completedMaterials.has(material.id) ? 'Completed' : 'Not Started'}
                              </span>
                              {!material.isLocked ? (
                                <Link
                                  href={`/student/material/${material.id}`}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                  View PDF
                                </Link>
                              ) : (
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Show subsection without materials */}
                        {(!subSection.materials || subSection.materials.length === 0) && (
                          <div className="flex items-center justify-between py-3 pl-6 hover:bg-gray-50 rounded border-b border-gray-100">
                            <div className="flex items-center gap-4 flex-1">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="font-medium text-gray-900 min-w-[200px]">{subSection.title}</span>
                              <span className="text-gray-700">No materials</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">PDF</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                                Not Available
                              </span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                                View PDF
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Section Quizzes */}
                    {section.quizzes?.map((quiz) => {
                      const attempt = quizAttempts[quiz.id]
                      return (
                        <div key={quiz.id} className="flex items-center justify-between py-3 pl-6 hover:bg-gray-50 rounded border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-4 flex-1">
                            <HelpCircle className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-gray-900 min-w-[200px]">{quiz.title}</span>
                            <span className="text-gray-700">Quiz</span>
                            {quiz.isLocked && <Lock className="h-4 w-4 text-gray-400" />}
                          </div>
                          <div className="flex items-center gap-3">
                            {attempt && (
                              <div className="text-xs text-gray-600">
                                Attempts: {attempt.attempts} | Score: {attempt.lastScore}% | <span className={attempt.passed ? 'text-green-600' : 'text-red-600'}>{attempt.passed ? 'Passed' : 'Failed'}</span>
                              </div>
                            )}
                            {!quiz.isLocked ? (
                              <Link
                                href={`/student/quiz/${quiz.id}`}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                {attempt ? 'Retake Quiz' : 'Take Quiz'}
                              </Link>
                            ) : (
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function CourseContentPage({ params }: CourseContentPageProps) {
  return (
    <StudentAuthProvider>
      <CourseContentPageContent params={params} />
    </StudentAuthProvider>
  )
}