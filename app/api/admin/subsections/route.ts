import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

// POST - Create subsection
export async function POST(request: NextRequest) {
  try {
    const { courseId, sectionId, title, description, order } = await request.json()

    const subSection = {
      id: randomUUID(),
      courseId,
      sectionId,
      title,
      description,
      order,
      type: 'subsection',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'course-materials',
      Item: subSection
    })

    await docClient.send(command)
    return NextResponse.json({ success: true, subSection })
  } catch (error) {
    console.error('Error creating subsection:', error)
    return NextResponse.json({ success: false, message: 'Failed to create subsection' }, { status: 500 })
  }
}

// PUT - Update subsection
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, order } = await request.json()

    const subSection = {
      id,
      title,
      description,
      order,
      type: 'subsection',
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'course-materials',
      Item: subSection
    })

    await docClient.send(command)
    return NextResponse.json({ success: true, subSection })
  } catch (error) {
    console.error('Error updating subsection:', error)
    return NextResponse.json({ success: false, message: 'Failed to update subsection' }, { status: 500 })
  }
}

// DELETE - Remove subsection
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subSectionId = searchParams.get('id')

    if (!subSectionId) {
      return NextResponse.json({ success: false, message: 'SubSection ID required' }, { status: 400 })
    }

    const deleteCommand = new DeleteCommand({
      TableName: 'course-materials',
      Key: { id: subSectionId }
    })

    await docClient.send(deleteCommand)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subsection:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete subsection' }, { status: 500 })
  }
}