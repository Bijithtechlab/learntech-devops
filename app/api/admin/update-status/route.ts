import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
})
const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing id or status' },
        { status: 400 }
      )
    }

    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'course-registrations',
      Key: { id },
      UpdateExpression: 'SET PaymentStatus = :status, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString()
      }
    })

    await docClient.send(command)

    return NextResponse.json({ 
      success: true, 
      message: 'Status updated successfully' 
    })
  } catch (error) {
    console.error('Error updating status:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update status' },
      { status: 500 }
    )
  }
}