import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/quiz-attempt'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const courseId = searchParams.get('courseId')

    if (!email || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Missing email or courseId' },
        { status: 400 }
      )
    }

    const lambdaUrl = `${LAMBDA_API_URL}?email=${encodeURIComponent(email)}&courseId=${encodeURIComponent(courseId)}&t=${Date.now()}&r=${Math.random()}`
    const response = await fetch(lambdaUrl, {
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
  } catch (error) {
    console.error('Error calling quiz attempts Lambda:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz attempts', message: error.message },
      { status: 500 }
    )
  }
}