import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

AWS.config.update({
  region: 'ap-south-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function GET() {
  try {
    const params = {
      TableName: 'learntechCourse'
    }

    const result = await dynamodb.scan(params).promise()
    
    return NextResponse.json({
      success: true,
      courses: result.Items || []
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}