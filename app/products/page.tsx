'use client'
import { useState } from 'react'
import { MessageCircle, Bell, Users, Clock, CheckCircle, Play, Mail, ArrowRight } from 'lucide-react'

export default function ProductsPage() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your interest! We will contact you soon.')
    setShowContactForm(false)
    setFormData({ name: '', email: '', company: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            AI <span className="text-blue-600">Agentic</span> Chatbot
          </h1>
          <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Transform your customer support with intelligent 24/7 AI assistance that handles inquiries, captures leads, and escalates when needed.
          </p>
          <button
            onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Play className="h-5 w-5" />
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Intelligent Features That Drive Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI Agentic Chatbot goes beyond simple responses - it understands context, captures leads, and ensures no customer inquiry goes unnoticed.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex items-start gap-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Smart Conversations</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Context-aware responses that understand customer intent and provide relevant information about your products and services.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Real-Time Alerts</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Instant push notifications for complaints, demo requests, and critical customer interactions that need human attention.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Lead Capture</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Automatically collects customer contact information and schedules demos while maintaining natural conversation flow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">24/7 Availability</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Never miss a customer inquiry with round-the-clock AI assistance that handles multiple conversations simultaneously.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Complaint Management</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Identifies and escalates customer complaints with immediate notifications to ensure quick resolution and customer satisfaction.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">Human Escalation</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Seamlessly transfers complex queries to human agents when AI assistance isn't sufficient, ensuring customer satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch our comprehensive demo to see how the AI Agentic Chatbot transforms customer interactions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/x2Xl3EL2_3o?si=2jDQNRQ-7NTNI5Of"
                  title="AI Agentic Chatbot Demo"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect For Any Business
            </h2>
            <p className="text-xl text-gray-600">
              Our AI Agentic Chatbot adapts to various industries and business models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">E-commerce</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Product information and pricing</li>
                <li>• Order status inquiries</li>
                <li>• Return and refund assistance</li>
                <li>• Inventory availability</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Service Companies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Demo scheduling and appointments</li>
                <li>• Service inquiries and quotes</li>
                <li>• Technical support questions</li>
                <li>• Complaint handling and escalation</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">B2B Solutions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Lead qualification and capture</li>
                <li>• Product specification queries</li>
                <li>• Partnership inquiries</li>
                <li>• Custom solution requests</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Education Institutions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Course information and curriculum</li>
                <li>• Admission process and requirements</li>
                <li>• Class schedules and timings</li>
                <li>• Results and academic queries</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">
                Ready to Transform Your Customer Support?
              </h2>
              <p className="text-lg mb-4 text-blue-100">
                Join businesses that have already improved their customer satisfaction and reduced support costs with our AI Agentic Chatbot.
              </p>
              <p className="text-base mb-2">For more details and implementation, contact us at:</p>
              <a
                href="mailto:info@learntechlab.com"
                className="text-xl font-semibold text-white hover:text-blue-200 transition-colors flex items-center gap-2 justify-center"
              >
                <Mail className="h-5 w-5" />
                info@learntechlab.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Request Demo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Tell us about your requirements"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}