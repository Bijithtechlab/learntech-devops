import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin-quizzes'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(LAMBDA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling quiz Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create quiz',
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, message: 'Quiz ID required' }, { status: 400 })
    }

    const response = await fetch(`${LAMBDA_API_URL}?id=${id}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling quiz Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete quiz',
      error: error.message
    }, { status: 500 })
  }
}