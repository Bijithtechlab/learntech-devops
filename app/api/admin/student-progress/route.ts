import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin-student-progress'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${LAMBDA_API_URL}?t=${Date.now()}&r=${Math.random()}`, {
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
    console.error('Error calling admin student-progress Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch student progress',
      message: error.message
    }, { status: 500 })
  }
}