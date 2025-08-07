import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

AWS.config.update({ region: 'ap-south-1' })
const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const email = searchParams.get('email')

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Missing courseId' },
        { status: 400 }
      )
    }

    const result = await dynamodb.query({
      TableName: 'lms-live-sessions',
      IndexName: 'course-index',
      KeyConditionExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId
      }
    }).promise()

    const sessions = result.Items || []
    
    // Filter future sessions and sort by date
    const now = new Date().toISOString()
    const upcomingSessions = sessions
      .filter(session => session.scheduledDate > now)
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())

    return NextResponse.json({ 
      success: true, 
      sessions: upcomingSessions,
      totalSessions: sessions.length 
    })
  } catch (error) {
    console.error('Error fetching student live sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live sessions' },
      { status: 500 }
    )
  }
}