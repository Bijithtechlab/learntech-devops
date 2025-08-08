import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin-live-sessions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const email = searchParams.get('email')

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Missing courseId' },
        { status: 400 }
      )
    }

    const response = await fetch(`${LAMBDA_API_URL}?courseId=${encodeURIComponent(courseId)}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    const sessions = data.sessions || []
    
    // Manual status takes precedence over calculated status
    const now = new Date()
    const processedSessions = sessions.map((session: any) => {
      const sessionDate = new Date(session.scheduledDate)
      const sessionEndTime = new Date(sessionDate.getTime() + (session.duration * 60000))
      const joinTime = new Date(sessionDate.getTime() - (15 * 60000)) // 15 mins before
      
      let calculatedStatus = 'upcoming'
      let canJoin = false
      
      // Calculate status based on timing
      if (now > sessionEndTime) {
        calculatedStatus = 'completed'
      } else if (now >= sessionDate && now <= sessionEndTime) {
        calculatedStatus = 'live'
        canJoin = true
      } else if (now >= joinTime) {
        calculatedStatus = 'upcoming'
        canJoin = true
      }
      
      // Use manual status if set, otherwise use calculated status
      const finalStatus = session.status && session.status !== 'scheduled' ? session.status : calculatedStatus
      
      return {
        ...session,
        status: finalStatus,
        canJoin,
        joinTime: joinTime.toISOString(),
        endTime: sessionEndTime.toISOString()
      }
    })
    
    // Separate upcoming/live and past sessions based on calculated status
    const upcomingSessions = processedSessions
      .filter(session => session.status !== 'completed')
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      
    const pastSessions = processedSessions
      .filter(session => session.status === 'completed')
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())

    return NextResponse.json({ 
      success: true, 
      upcomingSessions,
      pastSessions,
      totalSessions: sessions.length,
      debug: {
        currentTime: now.toISOString(),
        processedCount: processedSessions.length
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error: any) {
    console.error('Error calling live-sessions Lambda:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live sessions', message: error.message },
      { status: 500 }
    )
  }
}