import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)
const s3Client = new S3Client({ region: 'ap-south-1' })

const BUCKET_NAME = 'learntechlab-course-materials'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const subSectionId = searchParams.get('subSectionId')
    
    if (!courseId || !subSectionId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    
    // Get video data from DynamoDB
    const videoId = `video-${subSectionId}`
    
    const getCommand = new QueryCommand({
      TableName: 'course-materials',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': videoId }
    })
    
    const result = await docClient.send(getCommand)
    const videoData = result.Items?.[0]
    
    if (!videoData || !videoData.videoUrl) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }
    
    // Extract S3 key from URL
    const s3Key = videoData.videoUrl.split('.amazonaws.com/')[1]
    
    // Get video from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key
    })
    
    const s3Response = await s3Client.send(getObjectCommand)
    
    if (!s3Response.Body) {
      return NextResponse.json({ error: 'Video content not found' }, { status: 404 })
    }
    
    // Convert stream to buffer
    const chunks = []
    const reader = s3Response.Body.transformToWebStream().getReader()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    
    const buffer = Buffer.concat(chunks)
    
    // Return video with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': s3Response.ContentType || 'video/quicktime',
        'Content-Length': buffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('Error proxying video:', error)
    return NextResponse.json({ error: 'Failed to load video' }, { status: 500 })
  }
}