'use client'
import { useState, useEffect } from 'react'
import { Plus, Upload, Edit, Trash2, FileText, HelpCircle, X, ChevronDown } from 'lucide-react'
import QuestionBuilder from '@/components/QuestionBuilder'
import AdminHeader from '@/components/AdminHeader'


interface Material {
  id: string
  title: string
  description: string
  type: 'pdf'
  order: number
  isLocked: boolean
  estimatedTime?: string
  pdfUrl?: string
  s3Key?: string
  subSectionId: string
}

interface Quiz {
  id: string
  title: string
  description: string
  order: number
  isLocked: boolean
  estimatedTime?: string
  sectionId: string
}

interface SubSection {
  id: string
  title: string
  description: string
  order: number
  materials: Material[]
  sectionId: string
}

interface Section {
  id: string
  title: string
  description: string
  order: number
  subSections: SubSection[]
  quizzes: Quiz[]
  courseId: string
}

export default function CourseManagementPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [showAddSection, setShowAddSection] = useState(false)
  const [showEditSection, setShowEditSection] = useState<Section | null>(null)
  const [showAddSubSection, setShowAddSubSection] = useState<string | null>(null)
  const [showEditSubSection, setShowEditSubSection] = useState<SubSection | null>(null)
  const [showAddMaterial, setShowAddMaterial] = useState<string | null>(null)
  const [showAddQuiz, setShowAddQuiz] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())


  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseMaterials()
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      if (data.success && data.courses.length > 0) {
        setCourses(data.courses)
        setSelectedCourse(data.courses[0].courseId)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchCourseMaterials = async () => {
    try {
      const response = await fetch(`/api/admin/course-materials?courseId=${selectedCourse}`)
      const data = await response.json()
      if (data.success) {
        setSections(data.sections || [])
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMaterial = async (materialId: string, s3Key?: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return

    try {
      const url = `/api/admin/materials?id=${materialId}${s3Key ? `&s3Key=${s3Key}` : ''}`
      const response = await fetch(url, { method: 'DELETE' })
      const data = await response.json()
      
      if (data.success) {
        fetchCourseMaterials()
      } else {
        alert('Failed to delete material')
      }
    } catch (error) {
      console.error('Error deleting material:', error)
      alert('Error deleting material')
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section and all its content?')) return

    try {
      const response = await fetch(`/api/admin/sections?id=${sectionId}`, { method: 'DELETE' })
      const data = await response.json()
      
      if (data.success) {
        fetchCourseMaterials()
      } else {
        alert('Failed to delete section')
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      alert('Error deleting section')
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

  const handleDeleteSubSection = async (subSectionId: string) => {
    if (!confirm('Are you sure you want to delete this sub-section and all its materials?')) return

    try {
      const response = await fetch(`/api/admin/subsections?id=${subSectionId}`, { method: 'DELETE' })
      const data = await response.json()
      
      if (data.success) {
        fetchCourseMaterials()
      } else {
        alert('Failed to delete sub-section')
      }
    } catch (error) {
      console.error('Error deleting sub-section:', error)
      alert('Error deleting sub-section')
    }
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
        <AdminHeader title="Course Materials">
          <a
            href="/admin"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </a>
        </AdminHeader>
        
        <div className="mb-8">
          
          <div className="flex items-center gap-4 mb-6">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowAddSection(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
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
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowEditSection(section)}
                      className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowAddSubSection(section.id)}
                      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Sub Section
                    </button>
                    <button
                      onClick={() => setShowAddQuiz(section.id)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Quiz
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {expandedSections.has(section.id) && (
                <div className="divide-y divide-gray-200">
                {/* Sub Sections */}
                {section.subSections?.map((subSection) => (
                  <div key={subSection.id} className="bg-gray-50 border-l-4 border-purple-400">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            {subSection.title}
                          </h4>
                          <p className="text-sm text-gray-600 ml-4">{subSection.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowEditSubSection(subSection)}
                            className="flex items-center gap-1 bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setShowAddMaterial(subSection.id)}
                            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                          >
                            <Plus className="h-3 w-3" />
                            Add Material
                          </button>
                          <button
                            onClick={() => handleDeleteSubSection(subSection.id)}
                            className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Sub Section Materials */}
                      <div className="ml-4 space-y-2">
                        {subSection.materials.map((material) => (
                          <div key={material.id} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <div>
                                <h5 className="font-medium text-gray-900 text-sm">{material.title}</h5>
                                <p className="text-xs text-gray-600">{material.description}</p>
                                {material.estimatedTime && (
                                  <span className="text-xs text-gray-500">Est. time: {material.estimatedTime}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                material.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {material.isLocked ? 'Locked' : 'Unlocked'}
                              </span>
                              <button
                                onClick={() => handleDeleteMaterial(material.id, material.s3Key)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {subSection.materials.length === 0 && (
                          <div className="p-4 text-center text-gray-500 text-sm bg-white rounded border">
                            No materials in this sub-section yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Section Quizzes */}
                {section.quizzes?.map((quiz) => (
                  <div key={quiz.id} className="p-4 hover:bg-gray-50 bg-green-50 border-l-4 border-green-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                          <p className="text-sm text-gray-600">{quiz.description}</p>
                          {quiz.estimatedTime && (
                            <span className="text-xs text-gray-500">Est. time: {quiz.estimatedTime}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          quiz.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {quiz.isLocked ? 'Locked' : 'Unlocked'}
                        </span>

                        <button
                          onClick={() => handleDeleteMaterial(quiz.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!section.subSections || section.subSections.length === 0) && (!section.quizzes || section.quizzes.length === 0) && (
                  <div className="p-8 text-center text-gray-500">
                    No sub-sections or quizzes in this section yet
                  </div>
                )}
                </div>
              )}
            </div>
          ))}
          
          {sections.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections found</h3>
              <p className="text-gray-600 mb-4">Create your first course section to get started</p>
              <button
                onClick={() => setShowAddSection(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add First Section
              </button>
            </div>
          )}
        </div>

        {/* Add Section Modal */}
        {showAddSection && (
          <AddSectionModal
            courseId={selectedCourse}
            onClose={() => setShowAddSection(false)}
            onSuccess={() => {
              setShowAddSection(false)
              fetchCourseMaterials()
            }}
          />
        )}

        {/* Add Sub Section Modal */}
        {showAddSubSection && (
          <AddSubSectionModal
            courseId={selectedCourse}
            sectionId={showAddSubSection}
            onClose={() => setShowAddSubSection(null)}
            onSuccess={() => {
              setShowAddSubSection(null)
              fetchCourseMaterials()
            }}
          />
        )}

        {/* Edit Section Modal */}
        {showEditSection && (
          <EditSectionModal
            section={showEditSection}
            onClose={() => setShowEditSection(null)}
            onSuccess={() => {
              setShowEditSection(null)
              fetchCourseMaterials()
            }}
          />
        )}

        {/* Edit Sub Section Modal */}
        {showEditSubSection && (
          <EditSubSectionModal
            subSection={showEditSubSection}
            courseId={selectedCourse}
            onClose={() => setShowEditSubSection(null)}
            onSuccess={() => {
              setShowEditSubSection(null)
              fetchCourseMaterials()
            }}
          />
        )}

        {/* Add Material Modal */}
        {showAddMaterial && (
          <AddMaterialModal
            courseId={selectedCourse}
            subSectionId={showAddMaterial}
            onClose={() => setShowAddMaterial(null)}
            onSuccess={() => {
              setShowAddMaterial(null)
              fetchCourseMaterials()
            }}
          />
        )}

        {/* Add Quiz Modal */}
        {showAddQuiz && (
          <AddQuizModal
            courseId={selectedCourse}
            sectionId={showAddQuiz}
            onClose={() => setShowAddQuiz(null)}
            onSuccess={() => {
              setShowAddQuiz(null)
              fetchCourseMaterials()
            }}
          />
        )}


      </div>
    </div>
  )
}

// Add Section Modal Component
function AddSectionModal({ courseId, onClose, onSuccess }: {
  courseId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(1)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          title,
          description,
          order
        })
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to create section')
      }
    } catch (error) {
      console.error('Error creating section:', error)
      alert('Error creating section')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
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
              {saving ? 'Creating...' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Sub Section Modal Component
function AddSubSectionModal({ courseId, sectionId, onClose, onSuccess }: {
  courseId: string
  sectionId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(1)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/subsections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          sectionId,
          title,
          description,
          order
        })
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to create sub-section')
      }
    } catch (error) {
      console.error('Error creating sub-section:', error)
      alert('Error creating sub-section')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Add Sub Section</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="1"
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
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Sub Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Section Modal Component
function EditSectionModal({ section, onClose, onSuccess }: {
  section: Section
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState(section.title)
  const [description, setDescription] = useState(section.description)
  const [order, setOrder] = useState(section.order)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: section.id,
          courseId: section.courseId,
          title,
          description,
          order
        })
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to update section')
      }
    } catch (error) {
      console.error('Error updating section:', error)
      alert('Error updating section')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Section</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
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
              {saving ? 'Updating...' : 'Update Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Sub Section Modal Component  
function EditSubSectionModal({ subSection, courseId, onClose, onSuccess }: {
  subSection: SubSection
  courseId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState(subSection.title)
  const [description, setDescription] = useState(subSection.description)
  const [order, setOrder] = useState(subSection.order)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/subsections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: subSection.id,
          courseId: courseId,
          sectionId: subSection.sectionId,
          title,
          description,
          order
        })
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to update sub-section')
      }
    } catch (error) {
      console.error('Error updating sub-section:', error)
      alert('Error updating sub-section')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Sub Section</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="1"
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
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Sub Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Material Modal Component
function AddMaterialModal({ courseId, subSectionId, onClose, onSuccess }: {
  courseId: string
  subSectionId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(1)
  const [estimatedTime, setEstimatedTime] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      
      if (file) {
        formData.append('file', file)
      }

      formData.append('materialData', JSON.stringify({
        courseId,
        subSectionId,
        title,
        description,
        order,
        estimatedTime,
        isLocked
      }))

      const response = await fetch('/api/admin/materials', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to create material')
      }
    } catch (error) {
      console.error('Error creating material:', error)
      alert('Error creating material')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Material to Sub Section</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Material Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Est. Time</label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g., 30 min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isLocked"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isLocked" className="text-sm text-gray-700">Lock this material</label>
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
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Quiz Modal Component
function AddQuizModal({ courseId, sectionId, onClose, onSuccess }: {
  courseId: string
  sectionId: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(1)
  const [timeLimit, setTimeLimit] = useState(30)
  const [passingScore, setPassingScore] = useState(70)
  const [maxAttempts, setMaxAttempts] = useState(3)
  const [randomizeQuestions, setRandomizeQuestions] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const addQuestion = () => {
    const newQuestion = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
      explanation: ''
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateEntireQuestion = (index: number, updatedQuestion: any) => {
    const updated = [...questions]
    updated[index] = updatedQuestion
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = value
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (questions.length === 0) {
      alert('Please add at least one question')
      return
    }
    setSaving(true)

    try {
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
      const response = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          sectionId,
          title,
          description,
          order,
          timeLimit,
          passingScore,
          maxAttempts,
          randomizeQuestions,
          isLocked,
          questions,
          totalPoints
        })
      })

      const data = await response.json()
      if (data.success) {
        onSuccess()
      } else {
        alert('Failed to create quiz')
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
      alert('Error creating quiz')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Create Advanced Quiz</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Quiz Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={2}
            />
          </div>

          {/* Quiz Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
              <input
                type="number"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
              />
            </div>
          </div>

          {/* Quiz Options */}
          <div className="flex gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="randomizeQuestions"
                checked={randomizeQuestions}
                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="randomizeQuestions" className="text-sm text-gray-700">Randomize Questions</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isLocked"
                checked={isLocked}
                onChange={(e) => setIsLocked(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isLocked" className="text-sm text-gray-700">Lock this quiz</label>
            </div>
          </div>

          {/* Questions Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Questions ({questions.length})</h4>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={updateQuestion}
                  onUpdateOption={updateOption}
                  onUpdateQuestion={updateEntireQuestion}
                  onRemove={removeQuestion}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || questions.length === 0}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}