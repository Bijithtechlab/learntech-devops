import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

// POST - Create section
export async function POST(request: NextRequest) {
  try {
    const { courseId, title, description, order } = await request.json()

    const section = {
      id: randomUUID(),
      courseId,
      title,
      description,
      order,
      type: 'section',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'course-materials',
      Item: section
    })

    await docClient.send(command)
    return NextResponse.json({ success: true, section })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ success: false, message: 'Failed to create section' }, { status: 500 })
  }
}

// PUT - Update section
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, order, courseId } = await request.json()

    const section = {
      id,
      courseId,
      title,
      description,
      order,
      type: 'section',
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'course-materials',
      Item: section
    })

    await docClient.send(command)
    return NextResponse.json({ success: true, section })
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ success: false, message: 'Failed to update section' }, { status: 500 })
  }
}

// DELETE - Remove section
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('id')

    if (!sectionId) {
      return NextResponse.json({ success: false, message: 'Section ID required' }, { status: 400 })
    }

    const deleteCommand = new DeleteCommand({
      TableName: 'course-materials',
      Key: { id: sectionId }
    })

    await docClient.send(deleteCommand)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete section' }, { status: 500 })
  }
}