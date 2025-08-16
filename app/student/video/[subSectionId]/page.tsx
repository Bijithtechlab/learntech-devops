'use client'
import { useState, useEffect } from 'react'
import { StudentAuthProvider, useStudentAuth } from '@/contexts/StudentAuthContext'
import { ArrowLeft, Video, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface VideoPageProps {
  params: {
    subSectionId: string
  }
  searchParams: {
    courseId: string
  }
}

function VideoPageContent({ params, searchParams }: VideoPageProps) {
  const { user } = useStudentAuth()
  const [videoData, setVideoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    if (user && searchParams.courseId) {
      fetchVideoData()
    }
  }, [user, params.subSectionId, searchParams.courseId])

  const fetchVideoData = async () => {
    try {
      // First verify enrollment
      if (!user?.enrolledCourses.includes(searchParams.courseId)) {
        setAccessDenied(true)
        setLoading(false)
        return
      }
      
      const response = await fetch(`https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-materials?courseId=${searchParams.courseId}`)
      const data = await response.json()
      
      if (data.success) {
        // Find the subsection with video
        let foundVideo = null
        let subSectionTitle = ''
        
        data.sections.forEach((section: any) => {
          section.subSections?.forEach((subSection: any) => {
            if (subSection.id === params.subSectionId && subSection.video) {
              foundVideo = subSection.video
              subSectionTitle = subSection.title
            }
          })
        })
        
        if (foundVideo) {
          setVideoData({ ...foundVideo, title: subSectionTitle })
        }
      }
    } catch (error) {
      console.error('Error fetching video:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You must be enrolled in this course to access video content.</p>
          <div className="space-y-2">
            <Link href="/student" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Dashboard
            </Link>
            <a href="mailto:info@learntechlab.com" className="block text-blue-600 hover:text-blue-700">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Not Found</h1>
          <Link href={`/student/course/${searchParams.courseId}`} className="text-blue-600 hover:text-blue-700">
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href={`/student/course/${searchParams.courseId}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course
            </Link>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-900">{videoData.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {videoData.youtubeId || videoData.videoType === 'youtube' || videoData.videoUrl?.includes('youtube.com/embed/') ? (
            <>
              <div className="relative w-full aspect-video rounded overflow-hidden bg-black">
                <iframe
                  src={`${videoData.videoUrl}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&fs=0`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={videoData.title}
                ></iframe>
                
                <div className="absolute top-0 right-0 w-24 h-20 bg-black opacity-90 z-10 pointer-events-auto"></div>
                <div className="absolute bottom-0 right-0 w-20 h-12 bg-black opacity-90 z-10 pointer-events-auto"></div>
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-auto"></div>
                <div className="absolute bottom-0 left-0 w-48 h-16 bg-black opacity-90 z-10 pointer-events-auto"></div>
                
              </div>
            </>
          ) : videoData.videoType === 'onedrive' || videoData.videoUrl?.includes('onedrive.live.com') || videoData.videoUrl?.includes('1drv.ms') ? (
            <>
              <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4">
                    <Video className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">OneDrive Video</h3>
                    <p className="text-gray-600 mb-4">This video is hosted on OneDrive and will open in a new tab.</p>
                  </div>
                  <button
                    onClick={() => {
                      // Log access attempt
                      console.log('OneDrive video access:', {
                        user: user?.email,
                        courseId: searchParams.courseId,
                        videoId: params.subSectionId,
                        timestamp: new Date().toISOString()
                      })
                      
                      // Show warning before opening
                      if (confirm('⚠️ IMPORTANT: This video is for enrolled students only.\n\n• Do not share this link\n• Do not download the video\n• Access is monitored\n\nClick OK to proceed to OneDrive.')) {
                        window.open(videoData.videoUrl, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Watch Video on OneDrive
                  </button>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Video Access Policy:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>This video is for enrolled students only</li>
                      <li>Downloading or sharing is prohibited</li>
                      <li>Access is logged and monitored</li>
                      <li>Violations may result in course access removal</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <video
              src={videoData.videoUrl}
              controls
              controlsList="nodownload"
              className="w-full rounded"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </main>
    </div>
  )
}

export default function VideoPage({ params, searchParams }: VideoPageProps) {
  return (
    <StudentAuthProvider>
      <VideoPageContent params={params} searchParams={searchParams} />
    </StudentAuthProvider>
  )
}