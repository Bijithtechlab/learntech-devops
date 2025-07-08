'use client'
import { useState, useEffect } from 'react'
import { StudentAuthProvider, useStudentAuth } from '@/contexts/StudentAuthContext'
import StudentLogin from '@/components/StudentLogin'
import StudentDashboard from '@/components/StudentDashboard'

function StudentErrorPage({ error }: { error: string }) {
  const getErrorMessage = () => {
    switch (error) {
      case 'NOT_REGISTERED':
        return {
          title: 'Registration Required',
          message: 'You are not registered for any courses. Please register first.',
          action: 'Register Now',
          link: '/register'
        }
      case 'PAYMENT_PENDING':
        return {
          title: 'Payment Processing',
          message: 'Your payment is being processed. Please contact info@learntechlab.com for assistance.',
          action: 'Contact Support',
          link: 'mailto:info@learntechlab.com'
        }
      case 'PAYMENT_REQUIRED':
        return {
          title: 'Payment Required',
          message: 'Your payment is required to access the student portal. Please contact info@learntechlab.com.',
          action: 'Contact Support',
          link: 'mailto:info@learntechlab.com'
        }
      default:
        return {
          title: 'Access Denied',
          message: 'Please contact info@learntechlab.com for assistance.',
          action: 'Contact Support',
          link: 'mailto:info@learntechlab.com'
        }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h2>
          <p className="text-gray-600 mb-6">{errorInfo.message}</p>
        </div>
        <div className="space-y-3">
          <a
            href={errorInfo.link}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            {errorInfo.action}
          </a>
          <a
            href="/"
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors inline-block"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

function StudentPortalContent() {
  const { user, loading } = useStudentAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  useEffect(() => {
    const handleAuthError = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      if (error) {
        setAuthError(error)
      }
    }
    handleAuthError()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (authError) {
    return <StudentErrorPage error={authError} />
  }

  if (!user) {
    return <StudentLogin />
  }

  return <StudentDashboard />
}

export default function StudentPortalPage() {
  return (
    <StudentAuthProvider>
      <StudentPortalContent />
    </StudentAuthProvider>
  )
}