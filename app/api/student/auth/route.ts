import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
})
const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const command = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'course-registrations',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    })

    const result = await docClient.send(command)
    const student = result.Items?.[0]

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'No registration found with this email' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        PaymentStatus: student.PaymentStatus,
        createdAt: student.createdAt
      }
    })
  } catch (error) {
    console.error('Student auth error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to authenticate student' },
      { status: 500 }
    )
  }
}