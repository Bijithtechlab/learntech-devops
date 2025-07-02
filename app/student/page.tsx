'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react'

interface StudentData {
  id: string
  firstName: string
  lastName: string
  email: string
  PaymentStatus: string
  createdAt: string
}

export default function StudentPage() {
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/student/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setStudent(result.student)
        setIsAuthenticated(true)
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Error accessing student portal')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Student Portal</h2>
            <p className="mt-2 text-gray-600">Enter your registered email to access course materials</p>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Accessing...' : 'Access Portal'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (student?.PaymentStatus !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Pending</h2>
            <p className="text-gray-600 mb-4">
              Your registration is confirmed, but payment is still pending. 
              Please complete your payment to access course materials.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Status:</strong> {student?.PaymentStatus}
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Contact admin for payment assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Welcome, {student?.firstName} {student?.lastName}</h1>
          <p className="mt-2 opacity-90">AI Powered SW Development, DevOps & Cloud Program</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Materials */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Course Materials</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Module 1: AI Fundamentals</h3>
                <p className="text-sm text-gray-600">Introduction to AI and Machine Learning</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Module 2: DevOps Basics</h3>
                <p className="text-sm text-gray-600">CI/CD, Docker, and Kubernetes</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">Module 3: Cloud Computing</h3>
                <p className="text-sm text-gray-600">AWS Services and Architecture</p>
              </div>
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold">Assignments</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Assignment 1: Docker Setup</h3>
                    <p className="text-sm text-gray-600">Due: Next Week</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Assignment 2: AWS Deployment</h3>
                    <p className="text-sm text-gray-600">Due: In 2 Weeks</p>
                  </div>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Not Started</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quizzes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold">Quizzes</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Quiz 1: AI Basics</h3>
                    <p className="text-sm text-gray-600">10 Questions</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Quiz 2: DevOps Tools</h3>
                    <p className="text-sm text-gray-600">15 Questions</p>
                  </div>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25%</div>
              <p className="text-gray-600">Course Completion</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1/3</div>
              <p className="text-gray-600">Assignments Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">0/2</div>
              <p className="text-gray-600">Quizzes Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}