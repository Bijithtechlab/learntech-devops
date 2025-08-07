import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

AWS.config.update({ region: 'ap-south-1' })
const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function PUT(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const body = await request.json()
    const { sessionId } = params

    const updateExpression = []
    const expressionAttributeValues: any = {}
    const expressionAttributeNames: any = {}

    Object.keys(body).forEach(key => {
      if (key !== 'id') {
        updateExpression.push(`#${key} = :${key}`)
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = body[key]
      }
    })

    expressionAttributeValues[':updatedAt'] = new Date().toISOString()
    updateExpression.push('#updatedAt = :updatedAt')
    expressionAttributeNames['#updatedAt'] = 'updatedAt'

    await dynamodb.update({
      TableName: 'lms-live-sessions',
      Key: { id: sessionId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }).promise()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating live session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update live session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const { sessionId } = params

    await dynamodb.delete({
      TableName: 'lms-live-sessions',
      Key: { id: sessionId }
    }).promise()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting live session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete live session' },
      { status: 500 }
    )
  }
}