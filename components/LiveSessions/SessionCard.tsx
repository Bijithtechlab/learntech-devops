'use client'
import { Calendar, Clock, Users, Video } from 'lucide-react'

interface SessionCardProps {
  session: {
    id: string
    title: string
    description: string
    instructorName: string
    scheduledDate: string
    duration: number
    zoomJoinUrl: string
    zoomMeetingId: string
    zoomPassword: string
    maxParticipants: number
    enrolledStudents: string[]
    status: string
  }
}

export default function SessionCard({ session }: SessionCardProps) {
  const sessionDate = new Date(session.scheduledDate)
  const now = new Date()
  const isUpcoming = sessionDate > now
  const isToday = sessionDate.toDateString() === now.toDateString()
  const timeUntil = sessionDate.getTime() - now.getTime()
  const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60))
  const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60))

  const getStatusColor = () => {
    if (!isUpcoming) return 'bg-gray-100 text-gray-800'
    if (isToday && hoursUntil <= 1) return 'bg-green-100 text-green-800'
    if (isToday) return 'bg-yellow-100 text-yellow-800'
    return 'bg-blue-100 text-blue-800'
  }

  const getStatusText = () => {
    if (!isUpcoming) return 'Completed'
    if (isToday && hoursUntil <= 1) return 'Starting Soon'
    if (isToday) return 'Today'
    return 'Upcoming'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Video className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
            <p className="text-gray-600 text-sm">{session.description}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{session.duration} minutes</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>Instructor: {session.instructorName}</span>
        </div>
      </div>

      {isUpcoming && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isToday && hoursUntil <= 1 ? (
                <span className="text-green-600 font-medium">
                  Starts in {hoursUntil > 0 ? `${hoursUntil}h ` : ''}{minutesUntil}m
                </span>
              ) : (
                <span>Meeting ID: {session.zoomMeetingId}</span>
              )}
            </div>
            
            <a
              href={session.zoomJoinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Join Session
            </a>
          </div>
          
          {session.zoomPassword && (
            <div className="mt-2 text-xs text-gray-500">
              Password: {session.zoomPassword}
            </div>
          )}
        </div>
      )}
    </div>
  )
}