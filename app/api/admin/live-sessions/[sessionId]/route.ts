import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin-live-sessions'

export async function PUT(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const body = await request.json()
    const { sessionId } = params

    const response = await fetch(`${LAMBDA_API_URL}/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling live-sessions Lambda:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update live session', message: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    const response = await fetch(`${LAMBDA_API_URL}/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling live-sessions Lambda:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete live session', message: error.message },
      { status: 500 }
    )
  }
}