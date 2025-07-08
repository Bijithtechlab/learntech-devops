import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const client = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: NextRequest) {
  try {
    const { quizId, email, answers, score, passed, timeSpent } = await request.json()

    if (!quizId || !email || !answers) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const quizAttempt = {
      id: randomUUID(),
      quizId,
      email,
      answers,
      score: score || 0,
      passed: passed || false,
      timeSpent: timeSpent || 0,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'quiz-attempts',
      Item: quizAttempt
    })

    await docClient.send(command)

    return NextResponse.json({
      success: true,
      message: 'Quiz attempt saved successfully',
      attemptId: quizAttempt.id
    })

  } catch (error) {
    console.error('Error saving quiz attempt:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save quiz attempt' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const quizId = searchParams.get('quizId')

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    let filterExpression = 'email = :email'
    let expressionAttributeValues: any = { ':email': email }

    if (quizId) {
      filterExpression += ' AND quizId = :quizId'
      expressionAttributeValues[':quizId'] = quizId
    }

    const command = new ScanCommand({
      TableName: 'quiz-attempts',
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues
    })

    const result = await docClient.send(command)

    return NextResponse.json({
      success: true,
      attempts: result.Items || []
    })

  } catch (error) {
    console.error('Error fetching quiz attempts:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quiz attempts' },
      { status: 500 }
    )
  }
}