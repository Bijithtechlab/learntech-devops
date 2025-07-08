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
  const [loading, setLoading] = useState(true)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

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
    try {
      console.log('Checking payment for user:', user?.email)
      
      // Direct check to admin API for registration status
      const response = await fetch('https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin')
      const data = await response.json()
      
      if (data.success) {
        const userRegistration = data.registrations.find((reg: any) => reg.email === user?.email)
        
        if (!userRegistration) {
          setPaymentError('NOT_REGISTERED')
          setLoading(false)
          return
        }
        
        if (userRegistration.PaymentStatus !== 'completed') {
          if (userRegistration.PaymentStatus === 'pending' || userRegistration.PaymentStatus === 'in-progress') {
            setPaymentError('PAYMENT_PENDING')
          } else {
            setPaymentError('PAYMENT_REQUIRED')
          }
          setLoading(false)
          return
        }
      }
      
      console.log('Payment check passed, fetching materials')
      await fetchCourseMaterials()
    } catch (error) {
      console.error('Payment check error:', error)
      // If API fails, allow access (fallback)
      await fetchCourseMaterials()
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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
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

  const courseTitle = params.courseId === 'ai-devops-cloud' 
    ? 'AI Powered Software Development, DevOps & Cloud' 
    : params.courseId

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
                <h1 className="text-lg font-semibold text-gray-900">{courseTitle}</h1>
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
        <div className="space-y-4">
          {courseSections.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="divide-y divide-gray-200">
                      {section.materials.map((material) => (
                        <div key={material.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {material.type === 'pdf' ? (
                                <FileText className="h-5 w-5 text-blue-500" />
                              ) : (
                                <HelpCircle className="h-5 w-5 text-green-500" />
                              )}
                              <div>
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  {material.title}
                                  {material.isLocked && <Lock className="h-4 w-4 text-gray-400" />}
                                </h4>
                                <p className="text-sm text-gray-600">{material.description}</p>
                                {material.estimatedTime && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">{material.estimatedTime}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!material.isLocked ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {material.type === 'pdf' ? (
                                    <Link
                                      href={`/student/material/${material.id}`}
                                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                      View PDF
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/student/quiz/${material.quizId || material.id}`}
                                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                                    >
                                      Take Quiz
                                    </Link>
                                  )}
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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