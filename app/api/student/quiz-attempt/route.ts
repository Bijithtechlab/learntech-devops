import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/quiz-attempt'

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

    // Trigger progress update after quiz submission
    if (data.success && body.email && body.quizId) {
      try {
        const quizResponse = await fetch(`https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-quiz/${body.quizId}`)
        const quizData = await quizResponse.json()
        
        if (quizData.success && quizData.quiz && quizData.quiz.courseId) {
          await fetch('/api/student/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: body.email, courseId: quizData.quiz.courseId })
          })
        }
      } catch (error) {
        console.error('Error updating progress after quiz:', error)
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling quiz attempt Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to save quiz attempt',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const quizId = searchParams.get('quizId')

    let url = `${LAMBDA_API_URL}?email=${email}`
    if (quizId) url += `&quizId=${quizId}`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Lambda function failed')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling quiz attempt Lambda:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch quiz attempts',
      error: error.message
    }, { status: 500 })
  }
}