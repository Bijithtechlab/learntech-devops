import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-materials'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID required' }, { status: 400 })
    }

    // Call Lambda function via API Gateway
    const response = await fetch(`${LAMBDA_API_URL}?courseId=${courseId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling Lambda function:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch materials',
      error: error.message
    }, { status: 500 })
  }
}