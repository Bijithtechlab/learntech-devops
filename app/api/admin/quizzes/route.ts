import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

// POST - Create quiz
export async function POST(request: NextRequest) {
  try {
    const { courseId, sectionId, title, description, order, estimatedTime, isLocked } = await request.json()

    const quiz = {
      id: randomUUID(),
      courseId,
      sectionId,
      title,
      description,
      order,
      estimatedTime,
      isLocked,
      type: 'quiz',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'course-materials',
      Item: quiz
    })

    await docClient.send(command)
    return NextResponse.json({ success: true, quiz })
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json({ success: false, message: 'Failed to create quiz' }, { status: 500 })
  }
}

// DELETE - Remove quiz
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('id')

    if (!quizId) {
      return NextResponse.json({ success: false, message: 'Quiz ID required' }, { status: 400 })
    }

    const deleteCommand = new DeleteCommand({
      TableName: 'course-materials',
      Key: { id: quizId }
    })

    await docClient.send(deleteCommand)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete quiz' }, { status: 500 })
  }
}