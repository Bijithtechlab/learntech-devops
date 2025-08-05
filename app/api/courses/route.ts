import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/courses'

export async function GET() {
  try {
    const lambdaUrl = `${LAMBDA_API_URL}?t=${Date.now()}`
    console.log('Fetching courses from Lambda:', lambdaUrl)
    const response = await fetch(lambdaUrl)
    const data = await response.json()
    console.log('Lambda response status:', response.status)
    
    const aiCourse = data.courses?.find(c => c.courseId === 'ai-devops-cloud')
    console.log('AI course status from Lambda:', aiCourse?.status)

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error: any) {
    console.error('Error calling courses Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch courses',
      message: error.message
    }, { status: 500 })
  }
}