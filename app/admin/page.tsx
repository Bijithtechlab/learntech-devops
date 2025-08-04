import AdminHeader from '@/components/AdminHeader'

export default function AdminPage() {

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Admin Dashboard" />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to <span className="text-gray-900">learn</span><span className="text-blue-600">techlab</span> <span className="text-gray-700">LMS</span></h2>
          <p className="text-gray-600 mb-6">Learning Management System - Manage your courses, materials, and registrations from here.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Course Registrations</h3>
              <p className="text-purple-600 text-sm mb-4">View and manage student registrations</p>
              <a
                href="/admin/CourseRegistrations"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                View Registrations
              </a>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Course Management</h3>
              <p className="text-green-600 text-sm mb-4">Create and manage courses</p>
              <a
                href="/admin/courses"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Manage Courses
              </a>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Course Materials</h3>
              <p className="text-blue-600 text-sm mb-4">Add sections, materials, and quizzes</p>
              <a
                href="/admin/course-materials"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Manage Materials
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}