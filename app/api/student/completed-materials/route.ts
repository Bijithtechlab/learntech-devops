import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const courseId = searchParams.get('courseId')

    if (!email || !courseId) {
      return NextResponse.json({ success: false, message: 'Email and courseId required' }, { status: 400 })
    }

    // Get all materials for the course
    const materialsCommand = new ScanCommand({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId AND #type = :type',
      ExpressionAttributeNames: { '#type': 'type' },
      ExpressionAttributeValues: { 
        ':courseId': courseId,
        ':type': 'pdf'
      }
    })

    const materialsResult = await docClient.send(materialsCommand)
    const courseMaterialIds = materialsResult.Items?.map(item => item.id) || []

    // Get completed materials for the user
    const completedCommand = new ScanCommand({
      TableName: 'student-progress',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { 
        ':email': email
      }
    })

    const completedResult = await docClient.send(completedCommand)
    
    // Filter completed materials that belong to this course
    const completedMaterials = completedResult.Items
      ?.filter(item => courseMaterialIds.includes(item.materialId))
      ?.map(item => item.materialId) || []

    return NextResponse.json({
      success: true,
      completedMaterials
    })
  } catch (error) {
    console.error('Error fetching completed materials:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch completed materials' },
      { status: 500 }
    )
  }
}