import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/complete-lesson'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Call Lambda function via API Gateway
    const response = await fetch(LAMBDA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    // Trigger progress update
    if (data.success && body.email && body.courseId) {
      try {
        await fetch('/api/student/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: body.email, courseId: body.courseId })
        })
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling complete-lesson Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to mark lesson complete',
      message: error.message
    }, { status: 500 })
  }
}