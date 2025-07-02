'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface Registration {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  education: string
  experience: string
  motivation: string
  referredBy: string
  collegeName: string
  createdAt: string
  PaymentStatus: string
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [updating, setUpdating] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check')
      const result = await response.json()
      
      if (!result.success || result.user.role !== 'admin') {
        router.push('/login')
        return
      }
      
      setUser(result.user)
      fetchRegistrations()
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations')
      const data = await response.json()
      if (data.success) {
        setRegistrations(data.registrations)
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      
      if (response.ok) {
        setRegistrations(prev => 
          prev.map(reg => reg.id === id ? { ...reg, PaymentStatus: newStatus } : reg)
        )
        
        // Send welcome email if status changed to completed
        if (newStatus === 'completed' && selectedRegistration) {
          try {
            await fetch('/api/send-welcome-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentId: selectedRegistration.id,
                email: selectedRegistration.email,
                firstName: selectedRegistration.firstName,
                lastName: selectedRegistration.lastName
              })
            })
            console.log('Welcome email sent successfully')
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
          }
        }
        
        setSelectedRegistration(null)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-red-100 text-red-800'
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Course Registrations</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Total Registrations: {registrations.length}</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Education</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRegistration(reg)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reg.firstName} {reg.lastName}
                      </div>
                      {reg.collegeName && (
                        <div className="text-sm text-gray-500">{reg.collegeName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reg.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reg.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reg.education}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reg.experience || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reg.PaymentStatus)}`}>
                        {reg.PaymentStatus}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRegistration.firstName} {selectedRegistration.lastName}</h2>
                    <p className="text-blue-100 mt-1">{selectedRegistration.email}</p>
                  </div>
                  <button onClick={() => setSelectedRegistration(null)} className="text-white hover:text-blue-200 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Contact Information</label>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Phone:</span>
                        <p className="font-medium text-gray-900">{selectedRegistration.phone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium text-gray-900">{selectedRegistration.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Academic Background</label>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Education:</span>
                        <p className="font-medium text-gray-900 capitalize">{selectedRegistration.education.replace('-', ' ')}</p>
                      </div>
                      {selectedRegistration.collegeName && (
                        <div>
                          <span className="text-sm text-gray-500">College:</span>
                          <p className="font-medium text-gray-900">{selectedRegistration.collegeName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Experience & Background</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Programming Experience:</span>
                      <p className="font-medium text-gray-900 capitalize">{selectedRegistration.experience || 'Not specified'}</p>
                    </div>
                    {selectedRegistration.referredBy && (
                      <div>
                        <span className="text-sm text-gray-500">Referred By:</span>
                        <p className="font-medium text-gray-900">{selectedRegistration.referredBy}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedRegistration.motivation && (
                  <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400">
                    <label className="block text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">Motivation</label>
                    <p className="text-gray-800 leading-relaxed">{selectedRegistration.motivation}</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-500">Registration Date:</span>
                    <p className="font-medium text-gray-900">{new Date(selectedRegistration.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Update Status:</span>
                    <div className="flex gap-2">
                      {['pending', 'in-progress', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedRegistration.id, status)}
                          disabled={updating || selectedRegistration.PaymentStatus === status}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                            selectedRegistration.PaymentStatus === status
                              ? status === 'completed' ? 'bg-green-600 text-white shadow-lg'
                                : status === 'in-progress' ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-red-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
                          } disabled:opacity-50 disabled:transform-none`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}