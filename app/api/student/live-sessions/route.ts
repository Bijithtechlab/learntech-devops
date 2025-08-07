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
    
    // Filter future sessions and sort by date
    const now = new Date().toISOString()
    const upcomingSessions = sessions
      .filter((session: any) => session.scheduledDate > now)
      .sort((a: any, b: any) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())

    return NextResponse.json({ 
      success: true, 
      sessions: upcomingSessions,
      totalSessions: sessions.length 
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