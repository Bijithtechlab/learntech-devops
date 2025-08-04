'use client'
import { useState, useEffect } from 'react'
import { Eye, X } from 'lucide-react'
import AdminHeader from '@/components/AdminHeader'

interface StudentProgress {
  email: string
  firstName: string
  lastName: string
  collegeName: string
  courseId: string
  courseName: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  quizScores: Array<{
    quizTitle: string
    score: number
    totalPoints: number
    passed: boolean
    attemptedAt: string
  }>
  lastActivity: string
}

export default function StudentProgressPage() {
  const [students, setStudents] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null)
  const [filters, setFilters] = useState({
    course: '',
    college: '',
    progressRange: ''
  })

  useEffect(() => {
    fetchStudentProgress()
  }, [])

  const fetchStudentProgress = async () => {
    try {
      const response = await fetch('/api/admin/student-progress')
      const data = await response.json()
      if (data.success) {
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching student progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    if (filters.course && !student.courseName.toLowerCase().includes(filters.course.toLowerCase())) return false
    if (filters.college && !student.collegeName.toLowerCase().includes(filters.college.toLowerCase())) return false
    if (filters.progressRange) {
      const [min, max] = filters.progressRange.split('-').map(Number)
      if (student.progressPercentage < min || student.progressPercentage > max) return false
    }
    return true
  })

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800'
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Student Progress">
          <a
            href="/admin"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </a>
        </AdminHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Progress</h3>
            <p className="text-2xl font-bold text-blue-600">
              {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.progressPercentage, 0) / students.length) : 0}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Students</h3>
            <p className="text-2xl font-bold text-green-600">
              {students.filter(s => s.progressPercentage > 0).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Completed Courses</h3>
            <p className="text-2xl font-bold text-purple-600">
              {students.filter(s => s.progressPercentage === 100).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <input
                type="text"
                value={filters.course}
                onChange={(e) => setFilters({...filters, course: e.target.value})}
                placeholder="Search by course name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
              <input
                type="text"
                value={filters.college}
                onChange={(e) => setFilters({...filters, college: e.target.value})}
                placeholder="Search by college name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress Range</label>
              <select
                value={filters.progressRange}
                onChange={(e) => setFilters({...filters, progressRange: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Progress</option>
                <option value="0-25">0-25%</option>
                <option value="26-50">26-50%</option>
                <option value="51-75">51-75%</option>
                <option value="76-100">76-100%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Progress Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Student Progress ({filteredStudents.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz Scores</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={`${student.email}-${student.courseId}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{student.collegeName}</div>
                        <div className="text-xs text-gray-400">{student.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{student.courseName}</div>
                      <div className="text-xs text-gray-500">{student.courseId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${student.progressPercentage}%`}}
                          ></div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getProgressColor(student.progressPercentage)}`}>
                          {student.progressPercentage}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {student.completedLessons}/{student.totalLessons} lessons
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.quizScores.length} quiz(es)
                      </div>
                      {student.quizScores.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Avg: {Math.round(student.quizScores.reduce((sum, q) => sum + (q.score / q.totalPoints * 100), 0) / student.quizScores.length)}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.lastActivity ? new Date(student.lastActivity).toLocaleDateString() : 'No activity'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {selectedStudent.firstName} {selectedStudent.lastName} - Progress Details
                  </h3>
                  <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Student Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Email:</span> {selectedStudent.email}</div>
                      <div><span className="font-medium">College:</span> {selectedStudent.collegeName}</div>
                      <div><span className="font-medium">Course:</span> {selectedStudent.courseName}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Progress Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Overall Progress:</span> {selectedStudent.progressPercentage}%</div>
                      <div><span className="font-medium">Completed Lessons:</span> {selectedStudent.completedLessons}/{selectedStudent.totalLessons}</div>
                      <div><span className="font-medium">Quiz Attempts:</span> {selectedStudent.quizScores.length}</div>
                    </div>
                  </div>
                </div>
                
                {selectedStudent.quizScores.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Quiz Scores</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quiz</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedStudent.quizScores.map((quiz, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{quiz.quizTitle}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {quiz.score}/{quiz.totalPoints} ({Math.round((quiz.score / quiz.totalPoints) * 100)}%)
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  quiz.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {quiz.passed ? 'Passed' : 'Failed'}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                {new Date(quiz.attemptedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}