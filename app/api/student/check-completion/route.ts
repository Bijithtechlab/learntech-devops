import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const materialId = searchParams.get('materialId')

    if (!email || !materialId) {
      return NextResponse.json({ success: false, message: 'Email and materialId required' }, { status: 400 })
    }

    const command = new QueryCommand({
      TableName: 'student-progress',
      IndexName: 'email-material-index',
      KeyConditionExpression: 'email = :email AND materialId = :materialId',
      ExpressionAttributeValues: {
        ':email': email,
        ':materialId': materialId
      }
    })

    const result = await docClient.send(command)
    const completed = (result.Items?.length || 0) > 0

    return NextResponse.json({ success: true, completed })
  } catch (error) {
    console.error('Error checking completion:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check completion' },
      { status: 500 }
    )
  }
}