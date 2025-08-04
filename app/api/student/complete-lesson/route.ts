import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: NextRequest) {
  try {
    const { email, courseId, materialId } = await request.json()

    if (!email || !courseId || !materialId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const progressItem = {
      id: randomUUID(),
      email,
      courseId,
      materialId,
      completedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'student-progress',
      Item: progressItem,
      ConditionExpression: 'attribute_not_exists(id)'
    })

    await docClient.send(command)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking lesson complete:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark lesson complete' },
      { status: 500 }
    )
  }
}