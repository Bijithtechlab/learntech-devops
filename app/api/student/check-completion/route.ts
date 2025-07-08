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
      return NextResponse.json({ error: 'Email and materialId required' }, { status: 400 })
    }

    // Check if lesson is completed
    const command = new QueryCommand({
      TableName: 'student-progress',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': `${email}#ai-devops-cloud#${materialId}`
      }
    })

    const result = await docClient.send(command)
    const completed = result.Items && result.Items.length > 0

    return NextResponse.json({ success: true, completed })
  } catch (error) {
    console.error('Check completion error:', error)
    return NextResponse.json({ success: true, completed: false })
  }
}