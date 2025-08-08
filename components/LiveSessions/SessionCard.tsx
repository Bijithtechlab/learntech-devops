'use client'
import { Calendar, Clock, Users, Video, Play, ExternalLink, CheckCircle } from 'lucide-react'

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
    status: 'upcoming' | 'live' | 'completed'
    canJoin?: boolean
    recordingUrl?: string
    joinTime?: string
    endTime?: string
  }
}

export default function SessionCard({ session }: SessionCardProps) {
  const sessionDate = new Date(session.scheduledDate)
  
  const getStatusBadge = () => {
    switch (session.status) {
      case 'live':
        return (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            LIVE
          </span>
        )
      case 'completed':
        return (
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            COMPLETED
          </span>
        )
      default:
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            UPCOMING
          </span>
        )
    }
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
        {getStatusBadge()}
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

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {session.status !== 'completed' && !session.canJoin && (
              <span>Join button will be available 15 minutes before the session starts</span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {session.status === 'completed' && session.recordingUrl && (
              <a
                href={session.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Watch Recording
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            
            {session.status !== 'completed' && (
              <a
                href={session.canJoin ? session.zoomJoinUrl : '#'}
                target={session.canJoin ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  session.canJoin
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={!session.canJoin ? (e) => e.preventDefault() : undefined}
              >
                <Video className="h-4 w-4" />
                {session.status === 'live' ? 'Join Live Session' : 'Join Session'}
                {session.canJoin && <ExternalLink className="h-3 w-3" />}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}