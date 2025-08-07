import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-completed-materials'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const courseId = searchParams.get('courseId')

    if (!email || !courseId) {
      return NextResponse.json({ success: false, message: 'Email and courseId required' }, { status: 400 })
    }

    const response = await fetch(`${LAMBDA_API_URL}?email=${encodeURIComponent(email)}&courseId=${encodeURIComponent(courseId)}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling student-completed-materials Lambda:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch completed materials', error: error.message },
      { status: 500 }
    )
  }
}