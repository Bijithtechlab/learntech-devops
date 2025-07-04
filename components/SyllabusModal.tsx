'use client'
import { useState } from 'react'
import { X, ChevronDown, ChevronRight, Play, FileText } from 'lucide-react'
import { SyllabusSection } from '@/data/syllabus'

interface SyllabusModalProps {
  isOpen: boolean
  onClose: () => void
  syllabus: SyllabusSection[]
  courseTitle: string
}

export default function SyllabusModal({ isOpen, onClose, syllabus, courseTitle }: SyllabusModalProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Course Syllabus</h2>
            <p className="text-blue-100 mt-1">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          <div className="space-y-4">
            {syllabus.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {section.items.length} items
                    </span>
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedSections.has(section.id) && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
                        {item.isQuiz ? (
                          <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        ) : (
                          <Play className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                        <span className="flex-1 text-gray-700">{item.title}</span>
                        {item.isQuiz && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            Quiz
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}