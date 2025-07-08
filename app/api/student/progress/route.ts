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
      return NextResponse.json({ error: 'Email and courseId required' }, { status: 400 })
    }

    // Get all materials for the course
    const materialsCommand = new ScanCommand({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId
      }
    })

    const materialsResult = await docClient.send(materialsCommand)
    const totalMaterials = materialsResult.Items?.length || 0
    
    console.log('Materials found for courseId:', courseId)
    console.log('Total materials count:', totalMaterials)
    console.log('Materials:', materialsResult.Items?.map(item => ({ id: item.id, title: item.title, type: item.type })))

    // Get student progress from StudentProgress table
    const progressCommand = new ScanCommand({
      TableName: 'student-progress',
      FilterExpression: 'studentEmail = :email AND courseId = :courseId AND completed = :true',
      ExpressionAttributeValues: {
        ':email': email,
        ':courseId': courseId,
        ':true': true
      }
    })

    let completedMaterials = 0
    try {
      const progressResult = await docClient.send(progressCommand)
      completedMaterials = progressResult.Items?.length || 0
      console.log('Progress check:', { email, courseId, completedMaterials, totalMaterials })
    } catch (progressError) {
      console.error('Error fetching progress:', progressError)
      // Continue with 0 completed materials if table doesn't exist
    }

    const progress = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0

    return NextResponse.json({
      success: true,
      progress: {
        courseId,
        totalLessons: totalMaterials,
        completedLessons: completedMaterials,
        progressPercentage: progress
      }
    })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}