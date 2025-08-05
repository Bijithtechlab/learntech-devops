import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin-courses'

export async function POST(request: NextRequest) {
  try {
    const courseData = await request.json()
    
    const response = await fetch(LAMBDA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling admin courses Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create course',
      message: error.message
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT request received for admin courses')
    const courseData = await request.json()
    console.log('Course data received:', courseData)
    
    console.log('Calling Lambda URL:', LAMBDA_API_URL)
    const response = await fetch(LAMBDA_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    })

    console.log('Lambda response status:', response.status)
    const data = await response.json()
    console.log('Lambda response data:', data)

    if (!response.ok) {
      console.error('Lambda response not ok:', response.status, data)
      throw new Error(data.error || 'Lambda function failed')
    }

    console.log('Returning success response')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling admin courses Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update course',
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${LAMBDA_API_URL}?courseId=${courseId}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling admin courses Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete course',
      message: error.message
    }, { status: 500 })
  }
}