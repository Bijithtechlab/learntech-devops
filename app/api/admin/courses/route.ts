import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

AWS.config.update({
  region: 'ap-south-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function POST(request: NextRequest) {
  try {
    const courseData = await request.json()
    
    const params = {
      TableName: 'learntechCourse',
      Item: {
        ...courseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }

    await dynamodb.put(params).promise()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const courseData = await request.json()
    
    const params = {
      TableName: 'learntechCourse',
      Item: {
        ...courseData,
        updatedAt: new Date().toISOString()
      }
    }

    await dynamodb.put(params).promise()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const params = {
      TableName: 'learntechCourse',
      Key: { courseId }
    }

    await dynamodb.delete(params).promise()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}