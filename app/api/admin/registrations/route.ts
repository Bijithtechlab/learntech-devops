import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
})
const docClient = DynamoDBDocumentClient.from(client)

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'course-registrations'
    })

    const result = await docClient.send(command)
    
    // Sort by creation date (newest first)
    const registrations = result.Items?.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) || []

    return NextResponse.json({
      success: true,
      registrations,
      count: registrations.length
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}