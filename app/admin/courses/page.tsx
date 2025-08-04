'use client'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'

interface Course {
  courseId: string
  title: string
  shortTitle: string
  description: string
  duration: string
  price: number
  level: string
  category: string
  features: string[]
  status: 'active' | 'coming-soon'
}

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      if (data.success) {
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      const response = await fetch(`/api/admin/courses?courseId=${courseId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setCourses(courses.filter(c => c.courseId !== courseId))
      } else {
        alert('Failed to delete course')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Error deleting course')
    }
  }

  const openAddModal = () => {
    setEditingCourse(null)
    setShowModal(true)
  }

  const openEditModal = (course: Course) => {
    setEditingCourse(course)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Course Management</h1>
          <div className="flex gap-4">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Course
            </button>
            <a
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.courseId} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(course)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteCourse(course.courseId)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{course.shortTitle}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium">₹{course.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{course.category}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {course.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                  {course.features.length > 3 && (
                    <span className="text-gray-500 text-xs">+{course.features.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">Create your first course to get started</p>
            <button
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Course
            </button>
          </div>
        )}

        {showModal && (
          <CourseModal
            course={editingCourse}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false)
              fetchCourses()
            }}
          />
        )}
      </div>
    </div>
  )
}

function CourseModal({ course, onClose, onSuccess }: {
  course: Course | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    courseId: course?.courseId || '',
    title: course?.title || '',
    shortTitle: course?.shortTitle || '',
    description: course?.description || '',
    duration: course?.duration || '',
    price: course?.price || 0,
    level: course?.level || 'Beginner',
    category: course?.category || 'Technology',
    features: course?.features?.join(', ') || '',
    status: course?.status || 'active'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const courseData = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      }

      const response = await fetch('/api/admin/courses', {
        method: course ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to save course')
      }
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Error saving course')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {course ? 'Edit Course' : 'Add New Course'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course ID</label>
              <input
                type="text"
                value={formData.courseId}
                onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={!!course}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Title</label>
              <input
                type="text"
                value={formData.shortTitle}
                onChange={(e) => setFormData({...formData, shortTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 4 months"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Technology">Technology</option>
                <option value="Management">Management</option>
                <option value="Cloud">Cloud</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'coming-soon'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Live Sessions, Hands-on Projects, AI Integration"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}