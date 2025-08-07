import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-check-completion'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const materialId = searchParams.get('materialId')

    if (!email || !materialId) {
      return NextResponse.json({ success: false, message: 'Email and materialId required' }, { status: 400 })
    }

    const response = await fetch(`${LAMBDA_API_URL}?email=${encodeURIComponent(email)}&materialId=${encodeURIComponent(materialId)}`, {
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
    console.error('Error calling student-check-completion Lambda:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check completion', error: error.message },
      { status: 500 }
    )
  }
}