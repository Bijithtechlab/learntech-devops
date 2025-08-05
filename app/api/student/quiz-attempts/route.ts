import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

AWS.config.update({
  region: 'ap-south-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient()

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

    // Get all quiz attempts for the user
    const attemptsResult = await dynamodb.scan({
      TableName: 'quiz-attempts',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise()

    const allAttempts = attemptsResult.Items || []

    // Filter attempts for quizzes belonging to the specific course
    const courseAttempts = []
    for (const attempt of allAttempts) {
      // Get quiz details to check course
      const quizResult = await dynamodb.get({
        TableName: 'course-materials',
        Key: { id: attempt.quizId }
      }).promise()

      if (quizResult.Item && quizResult.Item.courseId === courseId) {
        courseAttempts.push(attempt)
      }
    }

    // Sort by attemptedAt to get latest attempts
    courseAttempts.sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime())

    return NextResponse.json({
      success: true,
      quizAttempts: courseAttempts
    })
  } catch (error) {
    console.error('Error fetching quiz attempts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    )
  }
}