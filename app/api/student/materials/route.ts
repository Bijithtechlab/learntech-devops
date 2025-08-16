import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

const LAMBDA_API_URL = 'https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-materials'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID required' }, { status: 400 })
    }

    // Get materials from Lambda
    const response = await fetch(`${LAMBDA_API_URL}?courseId=${courseId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Lambda function failed')
    }

    // Get video data from DynamoDB
    const videoCommand = new ScanCommand({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId AND #type = :type',
      ExpressionAttributeNames: { '#type': 'type' },
      ExpressionAttributeValues: { 
        ':courseId': courseId,
        ':type': 'video'
      }
    })

    const videoResult = await docClient.send(videoCommand)
    const videos = videoResult.Items || []

    // Add video data to subsections
    if (data.success && data.sections && videos.length > 0) {
      data.sections.forEach((section: any) => {
        if (section.subSections) {
          section.subSections.forEach((subSection: any) => {
            const video = videos.find(v => v.subSectionId === subSection.id)
            if (video) {
              subSection.video = {
                id: video.id,
                videoUrl: (video.videoType === 'youtube' || video.youtubeId || video.videoType === 'onedrive') ? 
                  video.videoUrl : 
                  `/api/student/video-proxy?courseId=${courseId}&subSectionId=${subSection.id}`,
                videoDuration: video.videoDuration,
                videoSize: video.videoSize,
                videoStatus: video.videoStatus,
                youtubeId: video.youtubeId,
                videoType: video.videoType
              }
            }
          })
        }
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error calling Lambda function:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch materials',
      error: error.message
    }, { status: 500 })
  }
}