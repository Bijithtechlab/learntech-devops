import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-progress'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const courseId = searchParams.get('courseId')

    if (!email || !courseId) {
      return NextResponse.json({ success: false, error: 'Missing email or courseId' }, { status: 400 })
    }

    // Call Lambda function via API Gateway
    const response = await fetch(`${LAMBDA_API_URL}?email=${encodeURIComponent(email)}&courseId=${encodeURIComponent(courseId)}&t=${Date.now()}&r=${Math.random()}`, {
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

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error: any) {
    console.error('Error calling student-progress Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch progress',
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, courseId } = body

    if (!email || !courseId) {
      return NextResponse.json({ success: false, error: 'Missing email or courseId' }, { status: 400 })
    }

    // Trigger progress calculator
    const response = await fetch('https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/progress-calculator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, courseId })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error triggering progress update:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update progress',
      message: error.message
    }, { status: 500 })
  }
}