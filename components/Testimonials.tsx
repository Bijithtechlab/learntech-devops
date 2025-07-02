'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer at TechCorp',
      content: 'LearnTechLab transformed my career. The hands-on approach and mentorship helped me land my dream job.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Full Stack Developer at StartupXYZ',
      content: 'The curriculum is incredibly comprehensive. I gained practical skills that I use every day in my current role.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Frontend Developer at DesignCo',
      content: 'Amazing program! The projects were challenging and the support from instructors was outstanding.',
      rating: 5
    }
  ]

  const [current, setCurrent] = useState(0)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
        </div>
        <div className="relative">
          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="flex mb-4">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-lg text-gray-700 mb-6">"{testimonials[current].content}"</p>
            <div>
              <p className="font-semibold text-gray-900">{testimonials[current].name}</p>
              <p className="text-gray-600">{testimonials[current].role}</p>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button 
              onClick={() => setCurrent(current === 0 ? testimonials.length - 1 : current - 1)}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-blue-600" />
            </button>
            <button 
              onClick={() => setCurrent(current === testimonials.length - 1 ? 0 : current + 1)}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}