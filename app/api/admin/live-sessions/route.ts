import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'
import { randomUUID } from 'crypto'

AWS.config.update({ region: 'ap-south-1' })
const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    let params: any = {
      TableName: 'lms-live-sessions'
    }

    if (courseId) {
      params = {
        TableName: 'lms-live-sessions',
        IndexName: 'course-index',
        KeyConditionExpression: 'courseId = :courseId',
        ExpressionAttributeValues: {
          ':courseId': courseId
        }
      }
      const result = await dynamodb.query(params).promise()
      return NextResponse.json({ success: true, sessions: result.Items || [] })
    } else {
      const result = await dynamodb.scan(params).promise()
      return NextResponse.json({ success: true, sessions: result.Items || [] })
    }
  } catch (error) {
    console.error('Error fetching live sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      courseId,
      title,
      description,
      instructorName,
      scheduledDate,
      duration,
      zoomMeetingId,
      zoomJoinUrl,
      zoomPassword,
      maxParticipants
    } = body

    const sessionId = randomUUID()
    const session = {
      id: sessionId,
      courseId,
      title,
      description,
      instructorName,
      scheduledDate,
      duration: parseInt(duration),
      zoomMeetingId,
      zoomJoinUrl,
      zoomPassword,
      maxParticipants: parseInt(maxParticipants),
      enrolledStudents: [],
      status: 'scheduled',
      recordingUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await dynamodb.put({
      TableName: 'lms-live-sessions',
      Item: session
    }).promise()

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error('Error creating live session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create live session' },
      { status: 500 }
    )
  }
}