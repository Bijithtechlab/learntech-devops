'use client'
import { useEffect, useState } from 'react'
import { useStudentAuth } from '@/contexts/StudentAuthContext'
import { Award, Clock, CheckCircle, XCircle } from 'lucide-react'

interface QuizAttempt {
  id: string
  quizId: string
  score: number
  passed: boolean
  completedAt: string
  timeSpent: number
}

export default function QuizResults() {
  const { user } = useStudentAuth()
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchQuizAttempts()
    }
  }, [user])

  const fetchQuizAttempts = async () => {
    try {
      const response = await fetch(`/api/student/quiz-attempt?email=${user?.email}`)
      const data = await response.json()
      if (data.success) {
        setAttempts(data.attempts)
      }
    } catch (error) {
      console.error('Error fetching quiz attempts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Attempts</h3>
        <p className="text-gray-600">You haven't taken any quizzes yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quiz Results</h3>
      <div className="space-y-3">
        {attempts.slice(0, 5).map((attempt) => (
          <div key={attempt.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {attempt.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    Quiz {attempt.quizId}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(attempt.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {attempt.score}%
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(attempt.timeSpent)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}