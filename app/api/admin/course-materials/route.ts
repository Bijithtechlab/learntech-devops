import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)
const s3Client = new S3Client({ region: 'ap-south-1' })

const BUCKET_NAME = 'learntechlab-course-materials'

// In-memory storage for video data (in production, this would be DynamoDB)
const videoStorage: Record<string, any> = {}



// Handle preview URL generation in GET method
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'preview-url') {
      const courseId = searchParams.get('courseId')
      const subSectionId = searchParams.get('subSectionId')
      
      if (!courseId || !subSectionId) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing required parameters' 
        }, { status: 400 })
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
        return NextResponse.json({ 
          success: false, 
          message: 'Video not found' 
        }, { status: 404 })
      }
      
      // Extract S3 key from URL
      const s3Key = videoData.videoUrl.split('.amazonaws.com/')[1]
      
      // Generate signed URL for viewing
      const getObjectCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key
      })
      
      const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 })
      
      // Instead of returning signed URL, return our proxy URL
      return NextResponse.json({
        success: true,
        signedUrl: `/api/admin/course-materials/video-proxy?courseId=${courseId}&subSectionId=${subSectionId}`
      })
    }
    
    // Regular course materials fetch
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID required' }, { status: 400 })
    }

    // Use scan to get all items for this course including sections
    const command = new ScanCommand({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId',
      ExpressionAttributeValues: { ':courseId': courseId }
    })

    const result = await docClient.send(command)
    
    // Group by sections, subsections, and materials
    const sections: any = {}
    const subSections: any = {}
    
    result.Items?.forEach(item => {
      if (item.type === 'section') {
        sections[item.id] = {
          id: item.id,
          title: item.title,
          description: item.description,
          order: item.order,
          courseId: item.courseId,
          subSections: [],
          quizzes: []
        }
      } else if (item.type === 'subsection') {
        if (!subSections[item.sectionId]) {
          subSections[item.sectionId] = []
        }
        subSections[item.sectionId].push({
          id: item.id,
          title: item.title,
          description: item.description,
          order: item.order,
          sectionId: item.sectionId,
          materials: []
        })
      } else if (item.type === 'quiz') {
        if (sections[item.sectionId]) {
          sections[item.sectionId].quizzes.push(item)
        }
      } else if (item.type === 'pdf' && item.subSectionId) {
        // Store materials separately to attach later
        if (!result.materials) result.materials = []
        result.materials.push(item)
      } else if (item.type === 'video' && item.subSectionId) {
        // Store videos separately to attach later
        if (!result.videos) result.videos = []
        result.videos.push(item)
      }
    })
    
    // Attach materials to subsections
    if (result.materials) {
      result.materials.forEach((material: any) => {
        Object.values(subSections).flat().forEach((subSection: any) => {
          if (subSection.id === material.subSectionId) {
            subSection.materials.push(material)
          }
        })
      })
    }
    
    // Attach videos to subsections
    if (result.videos) {
      result.videos.forEach((video: any) => {
        Object.values(subSections).flat().forEach((subSection: any) => {
          if (subSection.id === video.subSectionId) {
            subSection.video = video
          }
        })
      })
    }
    
    // Attach subsections to sections
    Object.keys(subSections).forEach(sectionId => {
      if (sections[sectionId]) {
        sections[sectionId].subSections = subSections[sectionId].sort((a: any, b: any) => a.order - b.order)
      }
    })

    const sectionsArray = Object.values(sections)
      .map((section: any) => ({
        ...section,
        subSections: section.subSections.map((subSection: any) => ({
          ...subSection,
          materials: subSection.materials.sort((a: any, b: any) => a.order - b.order),
          // Video data is already attached from DynamoDB
          video: subSection.video || null
        })),
        quizzes: section.quizzes.sort((a: any, b: any) => a.order - b.order)
      }))
      .sort((a: any, b: any) => a.order - b.order)

    return NextResponse.json({ success: true, sections: sectionsArray })
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch materials' }, { status: 500 })
  }
}

// Handle video upload operations
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'upload-file') {
      // Handle direct file upload through API
      const formData = await request.formData()
      const file = formData.get('file') as File
      const courseId = formData.get('courseId') as string
      const subSectionId = formData.get('subSectionId') as string
      
      if (!file || !courseId || !subSectionId) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing required fields' 
        }, { status: 400 })
      }
      
      // Generate S3 key
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const s3Key = `${courseId}/videos/${subSectionId}/${timestamp}-${randomId}.${fileExtension}`
      
      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type
      })
      
      await s3Client.send(uploadCommand)
      
      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        videoUrl: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${s3Key}`
      })
    }
    
    if (action === 'upload-url') {
      const { courseId, subSectionId, fileName, fileSize, fileType } = await request.json()
      
      // Validate input
      if (!courseId || !subSectionId || !fileName) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing required fields' 
        }, { status: 400 })
      }

      // Validate file size (500MB limit)
      if (fileSize > 500 * 1024 * 1024) {
        return NextResponse.json({ 
          success: false, 
          message: 'File size exceeds 500MB limit' 
        }, { status: 400 })
      }

      // Generate unique file name in correct S3 folder structure
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = fileName.split('.').pop()
      const s3Key = `${courseId}/videos/${subSectionId}/${timestamp}-${randomId}.${fileExtension}`
      
      // Generate real pre-signed URL for S3 upload
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        ContentType: fileType
      })
      
      const presignedUrl = await getSignedUrl(s3Client, uploadCommand, { expiresIn: 3600 })
      
      return NextResponse.json({
        success: true,
        uploadUrl: presignedUrl,
        videoUrl: `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${s3Key}`,
        s3Key
      })
    }
    

    if (action === 'onedrive') {
      const { courseId, subSectionId, onedriveUrl } = await request.json()
      
      if (!courseId || !subSectionId || !onedriveUrl) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing required fields' 
        }, { status: 400 })
      }
      
      // Store original OneDrive URL - conversion will happen in frontend
      const embedUrl = onedriveUrl
      
      console.log('Original OneDrive URL:', onedriveUrl)
      console.log('Converted embed URL:', embedUrl)
      
      // Store OneDrive video data
      const videoKey = `${courseId}-${subSectionId}`
      videoStorage[videoKey] = {
        id: `video-${subSectionId}`,
        subSectionId,
        videoUrl: embedUrl,
        originalUrl: onedriveUrl,
        videoDuration: 0,
        videoSize: 0,
        uploadedAt: new Date().toISOString(),
        videoStatus: 'ready',
        type: 'onedrive'
      }
      
      // Also store in DynamoDB
      const videoMetadata = {
        id: `video-${subSectionId}`,
        courseId,
        subSectionId,
        type: 'video',
        videoUrl: embedUrl,
        originalUrl: onedriveUrl,
        videoDuration: 0,
        videoSize: 0,
        uploadedAt: new Date().toISOString(),
        videoStatus: 'ready',
        videoType: 'onedrive'
      }
      
      const command = new PutCommand({
        TableName: 'course-materials',
        Item: videoMetadata
      })
      
      await docClient.send(command)
      
      return NextResponse.json({
        success: true,
        message: 'OneDrive video added successfully'
      })
    }
    
    if (action === 'youtube') {
      const { courseId, subSectionId, youtubeUrl } = await request.json()
      
      if (!courseId || !subSectionId || !youtubeUrl) {
        return NextResponse.json({ 
          success: false, 
          message: 'Missing required fields' 
        }, { status: 400 })
      }
      
      // Extract YouTube video ID with improved regex
      let videoId = ''
      
      // Handle different YouTube URL formats
      if (youtubeUrl.includes('youtu.be/')) {
        // Format: https://youtu.be/MKKrFzUVcgQ
        videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0]
      } else if (youtubeUrl.includes('youtube.com/watch?v=')) {
        // Format: https://www.youtube.com/watch?v=MKKrFzUVcgQ
        const urlParams = new URLSearchParams(youtubeUrl.split('?')[1])
        videoId = urlParams.get('v') || ''
      } else if (youtubeUrl.includes('youtube.com/embed/')) {
        // Format: https://www.youtube.com/embed/MKKrFzUVcgQ
        videoId = youtubeUrl.split('embed/')[1].split('?')[0]
      } else if (youtubeUrl.includes('youtube.com/shorts/')) {
        // Format: https://www.youtube.com/shorts/0F5F6YKMnSk
        videoId = youtubeUrl.split('shorts/')[1].split('?')[0]
      }
      
      if (!videoId || videoId.length !== 11) {
        return NextResponse.json({ 
          success: false, 
          message: `Invalid YouTube URL. Could not extract video ID from: ${youtubeUrl}` 
        }, { status: 400 })
      }
      
      // Store YouTube video data
      const videoKey = `${courseId}-${subSectionId}`
      videoStorage[videoKey] = {
        id: `video-${subSectionId}`,
        subSectionId,
        videoUrl: `https://www.youtube.com/embed/${videoId}`,
        youtubeId: videoId,
        originalUrl: youtubeUrl,
        videoDuration: 0, // YouTube duration would need API call to get
        videoSize: 0,
        uploadedAt: new Date().toISOString(),
        videoStatus: 'ready',
        type: 'youtube'
      }
      
      // Also store in DynamoDB
      const videoMetadata = {
        id: `video-${subSectionId}`,
        courseId,
        subSectionId,
        type: 'video',
        videoUrl: `https://www.youtube.com/embed/${videoId}`,
        youtubeId: videoId,
        originalUrl: youtubeUrl,
        videoDuration: 0,
        videoSize: 0,
        uploadedAt: new Date().toISOString(),
        videoStatus: 'ready',
        videoType: 'youtube'
      }
      
      const command = new PutCommand({
        TableName: 'course-materials',
        Item: videoMetadata
      })
      
      await docClient.send(command)
      
      return NextResponse.json({
        success: true,
        message: 'YouTube video added successfully'
      })
    }
    
    if (action === 'complete') {
      const { courseId, subSectionId, videoUrl } = await request.json()
      
      // Store video metadata in DynamoDB
      const videoMetadata = {
        id: `video-${subSectionId}`,
        courseId,
        subSectionId,
        type: 'video',
        videoUrl,
        videoDuration: 1800, // 30 minutes
        videoSize: 150 * 1024 * 1024, // 150MB
        uploadedAt: new Date().toISOString(),
        videoStatus: 'ready'
      }
      
      const command = new PutCommand({
        TableName: 'course-materials',
        Item: videoMetadata
      })
      
      await docClient.send(command)
      
      // Also store in memory for immediate access
      const videoKey = `${courseId}-${subSectionId}`
      videoStorage[videoKey] = videoMetadata
      
      return NextResponse.json({
        success: true,
        message: 'Video upload completed successfully'
      })
    }
    
    // Handle regular material creation (original functionality)
    const formData = await request.formData()
    const file = formData.get('file') as File
    const materialData = JSON.parse(formData.get('materialData') as string)

    let s3Key = ''
    let pdfUrl = ''

    // Upload PDF to S3 if file provided
    if (file) {
      s3Key = `${materialData.courseId}/${materialData.sectionId}/${randomUUID()}-${file.name}`
      
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: 'application/pdf'
      })

      await s3Client.send(uploadCommand)
      pdfUrl = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${s3Key}`
    }

    // Save material metadata to DynamoDB
    const material = {
      id: materialData.id || randomUUID(),
      courseId: materialData.courseId,
      subSectionId: materialData.subSectionId,
      title: materialData.title,
      description: materialData.description,
      type: 'pdf',
      order: materialData.order,
      isLocked: materialData.isLocked || false,
      estimatedTime: materialData.estimatedTime,
      s3Key: s3Key || materialData.s3Key,
      pdfUrl: pdfUrl || materialData.pdfUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: 'course-materials',
      Item: material
    })

    await docClient.send(command)

    return NextResponse.json({ success: true, material })

  } catch (error) {
    console.error('Error handling request:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 })
  }
}

// DELETE - Remove course material or video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('id')
    const s3Key = searchParams.get('s3Key')
    const courseId = searchParams.get('courseId')
    const subSectionId = searchParams.get('subSectionId')
    
    // Handle video deletion
    if (courseId && subSectionId && !materialId) {
      // Find video in DynamoDB
      const videoId = `video-${subSectionId}`
      
      try {
        // Get video data first
        const getCommand = new QueryCommand({
          TableName: 'course-materials',
          KeyConditionExpression: 'id = :id',
          ExpressionAttributeValues: { ':id': videoId }
        })
        
        const result = await docClient.send(getCommand)
        const videoData = result.Items?.[0]
        
        // Delete from S3 if video exists
        if (videoData && videoData.videoUrl) {
          const s3Key = videoData.videoUrl.split('.amazonaws.com/')[1]
          if (s3Key) {
            const deleteS3Command = new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: s3Key
            })
            await s3Client.send(deleteS3Command)
          }
        }
        
        // Delete from DynamoDB
        const deleteCommand = new DeleteCommand({
          TableName: 'course-materials',
          Key: { id: videoId }
        })
        
        await docClient.send(deleteCommand)
        
        // Remove from memory cache
        const videoKey = `${courseId}-${subSectionId}`
        delete videoStorage[videoKey]
        
        return NextResponse.json({ success: true, message: 'Video deleted successfully' })
      } catch (error) {
        console.error('Error deleting video:', error)
        return NextResponse.json({ success: false, message: 'Failed to delete video' }, { status: 500 })
      }
    }
    
    // Handle material deletion (original functionality)
    if (!materialId) {
      return NextResponse.json({ success: false, message: 'Material ID required' }, { status: 400 })
    }

    // Delete from S3 if s3Key provided
    if (s3Key) {
      const deleteS3Command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key
      })
      await s3Client.send(deleteS3Command)
    }

    // Delete from DynamoDB
    const deleteCommand = new DeleteCommand({
      TableName: 'course-materials',
      Key: { id: materialId }
    })

    await docClient.send(deleteCommand)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 })
  }
}