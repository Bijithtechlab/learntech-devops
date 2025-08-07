import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/admin-quiz-questions'

// GET - Fetch quiz questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')

    if (!quizId) {
      return NextResponse.json({ success: false, message: 'Quiz ID required' }, { status: 400 })
    }

    const response = await fetch(`${LAMBDA_API_URL}?quizId=${encodeURIComponent(quizId)}`, {
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
    console.error('Error calling admin-quiz-questions Lambda:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch questions', error: error.message }, { status: 500 })
  }
}

// POST - Create/Update quiz question
export async function POST(request: NextRequest) {
  try {
    const questionData = await request.json()

    const response = await fetch(LAMBDA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling admin-quiz-questions Lambda:', error)
    return NextResponse.json({ success: false, message: 'Failed to create question', error: error.message }, { status: 500 })
  }
}

// DELETE - Remove quiz question
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('id')

    if (!questionId) {
      return NextResponse.json({ success: false, message: 'Question ID required' }, { status: 400 })
    }

    const response = await fetch(`${LAMBDA_API_URL}?id=${encodeURIComponent(questionId)}`, {
      method: 'DELETE'
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling admin-quiz-questions Lambda:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete question', error: error.message }, { status: 500 })
  }
}