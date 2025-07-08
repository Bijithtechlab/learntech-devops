import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ 
  region: 'ap-south-1',
  credentials: process.env.CUSTOM_AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY!
  } : undefined
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

    // Get enrolled courses from registrations table
    const command = new ScanCommand({
      TableName: 'course-registrations',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    })

    const result = await docClient.send(command)
    const courses = result.Items?.map(item => item.courseId) || []

    return NextResponse.json({
      success: true,
      courses: courses
    })

  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}