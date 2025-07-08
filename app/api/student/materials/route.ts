import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const dynamoClient = new DynamoDBClient({ 
  region: 'ap-south-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  } : undefined
})
const docClient = DynamoDBDocumentClient.from(dynamoClient)
const s3Client = new S3Client({ 
  region: 'ap-south-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  } : undefined
})

const BUCKET_NAME = 'learntechlab-course-materials'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID required' }, { status: 400 })
    }

    // Use scan to get all items for this course
    const command = new ScanCommand({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId',
      ExpressionAttributeValues: { ':courseId': courseId }
    })

    const result = await docClient.send(command)
    
    // Group by sections, subsections, and materials
    const sections: any = {}
    const subSections: any = {}
    const materials: any[] = []
    
    for (const item of result.Items || []) {
      if (item.type === 'section') {
        sections[item.id] = {
          id: item.id,
          title: item.title,
          description: item.description,
          order: item.order,
          materials: [] // For compatibility with existing student portal
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
          type: 'pdf', // Treat subsection as material for student view
          isLocked: false,
          materials: []
        })
      } else if (item.type === 'pdf' && item.subSectionId) {
        // Generate signed URL for PDF access
        let signedUrl = ''
        if (item.s3Key) {
          try {
            const getObjectCommand = new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: item.s3Key
            })
            signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 })
          } catch (error) {
            console.error('Error generating signed URL:', error)
          }
        }
        
        materials.push({
          ...item,
          pdfUrl: signedUrl || item.pdfUrl
        })
      } else if (item.type === 'quiz') {
        // Add quiz as material to section (with high order to appear last)
        if (sections[item.sectionId]) {
          sections[item.sectionId].materials.push({
            id: item.id,
            title: item.title,
            description: item.description,
            type: 'quiz',
            order: 9999 + item.order, // High order to ensure quizzes appear last
            isLocked: item.isLocked,
            estimatedTime: item.estimatedTime,
            quizId: item.id
          })
        }
      }
    }
    
    // Convert subsections to materials for student view
    Object.keys(subSections).forEach(sectionId => {
      if (sections[sectionId]) {
        subSections[sectionId].forEach((subSection: any) => {
          // Find materials for this subsection
          const subSectionMaterials = materials.filter(m => m.subSectionId === subSection.id)
          
          // Add each material as a separate item
          subSectionMaterials.forEach(material => {
            sections[sectionId].materials.push({
              id: material.id,
              title: `${subSection.title} - ${material.title}`,
              description: material.description,
              type: 'pdf',
              order: subSection.order * 100 + material.order, // Ensure proper ordering
              pdfUrl: material.pdfUrl,
              isLocked: material.isLocked,
              estimatedTime: material.estimatedTime,
              sectionId: sectionId,
              sectionTitle: sections[sectionId].title
            })
          })
        })
      }
    })

    // Sort sections and materials by order
    const sectionsArray = Object.values(sections)
      .sort((a: any, b: any) => a.order - b.order)
      .map((section: any) => ({
        ...section,
        materials: section.materials.sort((a: any, b: any) => a.order - b.order)
      }))

    return NextResponse.json({ success: true, sections: sectionsArray })
  } catch (error: any) {
    console.error('Error fetching student materials:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    })
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch materials',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}