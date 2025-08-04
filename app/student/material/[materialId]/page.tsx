'use client'
import { useState, useEffect } from 'react'
import { StudentAuthProvider, useStudentAuth } from '@/contexts/StudentAuthContext'
import { getCourseMaterials, CourseMaterial } from '@/data/courseMaterials'
import { ArrowLeft, Download, CheckCircle, LogOut } from 'lucide-react'
import Link from 'next/link'

interface MaterialViewerPageProps {
  params: {
    materialId: string
  }
}

function MaterialViewerPageContent({ params }: MaterialViewerPageProps) {
  const { user } = useStudentAuth()
  const [material, setMaterial] = useState<CourseMaterial | null>(null)
  const [loading, setLoading] = useState(true)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (user) {
      fetchMaterial()
      checkIfCompleted()
    }
  }, [user, params.materialId])

  const checkIfCompleted = async () => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/student/check-completion?email=${user.email}&materialId=${params.materialId}`)
      const data = await response.json()
      if (data.success) {
        setIsCompleted(data.completed)
      }
    } catch (error) {
      console.error('Error checking completion:', error)
    }
  }

  const [courseId, setCourseId] = useState<string>('')

  const fetchMaterial = async () => {
    try {
      // Try to find material in dynamic data first
      for (const cId of user.enrolledCourses) {
        const response = await fetch(`/api/student/materials?courseId=${cId}`)
        const data = await response.json()
        
        if (data.success) {
          for (const section of data.sections) {
            // Check subsections for materials
            if (section.subSections) {
              for (const subSection of section.subSections) {
                if (subSection.materials) {
                  const mat = subSection.materials.find((m: any) => m.id === params.materialId)
                  if (mat) {
                    setMaterial({
                      ...mat,
                      sectionTitle: section.title
                    })
                    setCourseId(cId)
                    setLoading(false)
                    return
                  }
                }
              }
            }
          }
        }
      }
      
      // Fallback to static data
      let foundMaterial: CourseMaterial | null = null
      for (const courseId of user.enrolledCourses) {
        const sections = getCourseMaterials(courseId)
        for (const section of sections) {
          const mat = section.materials.find(m => m.id === params.materialId)
          if (mat) {
            foundMaterial = mat
            break
          }
        }
        if (foundMaterial) break
      }
      
      setMaterial(foundMaterial)
    } catch (error) {
      console.error('Error fetching material:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!material || !user || !courseId) return
    
    setMarkingComplete(true)
    try {
      const response = await fetch('/api/student/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          courseId: courseId,
          materialId: material.id
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setIsCompleted(true)
        alert('Lesson marked as complete!')
      } else {
        alert('Error: ' + result.error)
        console.error('API Error:', result)
      }
    } catch (error) {
      console.error('Error marking complete:', error)
      alert('Failed to mark lesson complete')
    } finally {
      setMarkingComplete(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Material Not Found</h1>
          <Link href="/student" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link 
                href={courseId ? `/student/course/${courseId}` : '/student'}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-lg font-semibold text-gray-900">{material.title}</h1>
                <p className="text-sm text-gray-600">{material.sectionTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {material.pdfUrl && (
                <a
                  href={material.pdfUrl}
                  download
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              )}
              <button
                onClick={handleMarkComplete}
                disabled={markingComplete || isCompleted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 ${
                  isCompleted 
                    ? 'bg-gray-500 text-white cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {isCompleted ? 'Completed' : markingComplete ? 'Marking...' : 'Mark Complete'}
              </button>
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
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
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="h-[calc(100vh-80px)]">
        {material.pdfUrl ? (
          <iframe
            src={material.pdfUrl}
            className="w-full h-full border-0"
            title={material.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">PDF Not Available</h2>
              <p className="text-gray-600">This material is not yet available for viewing.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function MaterialViewerPage({ params }: MaterialViewerPageProps) {
  return (
    <StudentAuthProvider>
      <MaterialViewerPageContent params={params} />
    </StudentAuthProvider>
  )
}