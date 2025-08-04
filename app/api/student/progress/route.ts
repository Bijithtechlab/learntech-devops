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
    const response = await fetch(`${LAMBDA_API_URL}?email=${encodeURIComponent(email)}&courseId=${encodeURIComponent(courseId)}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling student-progress Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch progress',
      message: error.message
    }, { status: 500 })
  }
}