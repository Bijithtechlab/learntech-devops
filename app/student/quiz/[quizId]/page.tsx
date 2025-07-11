'use client'
import { useState, useEffect } from 'react'
import { StudentAuthProvider, useStudentAuth } from '@/contexts/StudentAuthContext'
import { getQuizById, fetchQuizById, Quiz, QuizQuestion } from '@/data/quizData'
import { ArrowLeft, Clock, CheckCircle, XCircle, Award, LogOut } from 'lucide-react'
import Link from 'next/link'

interface QuizPageProps {
  params: {
    quizId: string
  }
}

function QuizPageContent({ params }: QuizPageProps) {
  const { user } = useStudentAuth()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuiz()
  }, [params.quizId])

  const loadQuiz = async () => {
    try {
      const quizData = await fetchQuizById(params.quizId)
      if (quizData) {
        setQuiz(quizData)
        setAnswers(new Array(quizData.questions.length).fill(-1))
        if (quizData.timeLimit) {
          setTimeLeft(quizData.timeLimit * 60) // Convert to seconds
        }
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizStarted, timeLeft, quizCompleted])

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    if (!quiz) return 0
    let correct = 0
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return
    
    const finalScore = calculateScore()
    const passed = finalScore >= quiz.passingScore
    
    setScore(finalScore)
    setQuizCompleted(true)
    setShowResults(true)

    // Save quiz attempt
    try {
      await fetch('/api/student/quiz-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          email: user.email,
          answers,
          score: finalScore,
          passed,
          timeSpent: quiz.timeLimit ? (quiz.timeLimit * 60 - timeLeft) : 0
        })
      })
    } catch (error) {
      console.error('Error saving quiz attempt:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
          <Link href="/student" className="text-blue-600 hover:text-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              {score >= quiz.passingScore ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz {score >= quiz.passingScore ? 'Passed!' : 'Failed'}
              </h1>
              <p className="text-xl text-gray-600">
                Your Score: {score}% (Passing: {quiz.passingScore}%)
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Results Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Correct Answers:</span>
                  <span className="font-semibold ml-2">
                    {Math.round((score / 100) * quiz.questions.length)} / {quiz.questions.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Time Spent:</span>
                  <span className="font-semibold ml-2">
                    {quiz.timeLimit ? formatTime(quiz.timeLimit * 60 - timeLeft) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/student"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
              {score < quiz.passingScore && (
                <button
                  onClick={() => window.location.reload()}
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-4">Quiz Information</h3>
              <div className="space-y-2 text-blue-800">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-semibold">{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passing Score:</span>
                  <span className="font-semibold">{quiz.passingScore}%</span>
                </div>
                {quiz.timeLimit && (
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-semibold">{quiz.timeLimit} minutes</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartQuiz}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/student" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{quiz.title}</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {quiz.timeLimit && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              )}
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

      {/* Quiz Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-700 mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    answers[index] !== -1 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={answers.includes(-1)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <StudentAuthProvider>
      <QuizPageContent params={params} />
    </StudentAuthProvider>
  )
}