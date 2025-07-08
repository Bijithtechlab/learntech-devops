import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

// GET - Fetch quiz questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quizId')

    if (!quizId) {
      return NextResponse.json({ success: false, message: 'Quiz ID required' }, { status: 400 })
    }

    const command = new QueryCommand({
      TableName: 'quiz-questions',
      IndexName: 'quiz-index',
      KeyConditionExpression: 'quizId = :quizId',
      ExpressionAttributeValues: { ':quizId': quizId }
    })

    const result = await docClient.send(command)
    
    return NextResponse.json({ 
      success: true, 
      questions: result.Items?.sort((a, b) => a.order - b.order) || []
    })
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch questions' }, { status: 500 })
  }
}

// POST - Create/Update quiz question
export async function POST(request: NextRequest) {
  try {
    const questionData = await request.json()

    const question = {
      id: questionData.id || randomUUID(),
      quizId: questionData.quizId,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      order: questionData.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'quiz-questions',
      Item: question
    })

    await docClient.send(command)

    return NextResponse.json({ success: true, question })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json({ success: false, message: 'Failed to create question' }, { status: 500 })
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

    const deleteCommand = new DeleteCommand({
      TableName: 'quiz-questions',
      Key: { id: questionId }
    })

    await docClient.send(deleteCommand)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete question' }, { status: 500 })
  }
}