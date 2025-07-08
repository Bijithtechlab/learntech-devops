import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: NextRequest) {
  try {
    const { email, courseId, materialId } = await request.json()

    if (!email || !courseId || !materialId) {
      return NextResponse.json({ error: 'Email, courseId, and materialId required' }, { status: 400 })
    }

    // Mark lesson as completed
    const command = new PutCommand({
      TableName: 'student-progress',
      Item: {
        id: `${email}#${courseId}#${materialId}`,
        studentEmail: email,
        courseId: courseId,
        materialId: materialId,
        completed: true,
        completedAt: new Date().toISOString()
      }
    })

    await docClient.send(command)
    console.log('Lesson marked complete:', { email, courseId, materialId })

    return NextResponse.json({ success: true, message: 'Lesson marked complete' })
  } catch (error: any) {
    console.error('Complete lesson error:', error)
    return NextResponse.json({ 
      error: 'Failed to mark lesson complete', 
      details: error.message 
    }, { status: 500 })
  }
}