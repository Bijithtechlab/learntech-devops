import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()

const BUCKET_NAME = 'learntechlab-course-materials'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ success: false, message: 'Course ID required' }, { status: 400 })
    }

    // Use scan to get all items for this course
    const params = {
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId',
      ExpressionAttributeValues: { ':courseId': courseId }
    }

    const result = await dynamodb.scan(params).promise()
    
    // Group by sections, subsections, and materials
    const sections: any = {}
    const subSections: any = {}
    const materials: any[] = []
    const quizzes: any[] = []
    
    for (const item of result.Items || []) {
      if (item.type === 'section') {
        sections[item.id] = {
          id: item.id,
          title: item.title,
          description: item.description,
          order: item.order,
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
      } else if (item.type === 'pdf' && item.subSectionId) {
        // Generate signed URL for PDF access
        let signedUrl = item.pdfUrl // fallback to original URL
        if (item.s3Key) {
          try {
            signedUrl = s3.getSignedUrl('getObject', {
              Bucket: BUCKET_NAME,
              Key: item.s3Key,
              Expires: 3600
            })
          } catch (error) {
            console.error('Error generating signed URL:', error)
            // Keep the original pdfUrl as fallback
          }
        }
        
        materials.push({
          ...item,
          pdfUrl: signedUrl
        })
      } else if (item.type === 'quiz') {
        quizzes.push({
          id: item.id,
          title: item.title,
          description: item.description,
          order: item.order,
          isLocked: item.isLocked,
          estimatedTime: item.estimatedTime,
          sectionId: item.sectionId
        })
      }
    }
    
    // Attach materials to subsections
    materials.forEach(material => {
      Object.keys(subSections).forEach(sectionId => {
        const sectionSubSections = subSections[sectionId]
        const targetSubSection = sectionSubSections.find((ss: any) => ss.id === material.subSectionId)
        if (targetSubSection) {
          targetSubSection.materials.push(material)
        }
      })
    })
    
    // Attach subsections to sections
    Object.keys(subSections).forEach(sectionId => {
      if (sections[sectionId]) {
        sections[sectionId].subSections = subSections[sectionId].sort((a: any, b: any) => a.order - b.order)
      }
    })
    
    // Attach quizzes to sections
    quizzes.forEach(quiz => {
      if (sections[quiz.sectionId]) {
        sections[quiz.sectionId].quizzes.push(quiz)
      }
    })
    
    // Sort quizzes within each section
    Object.values(sections).forEach((section: any) => {
      section.quizzes.sort((a: any, b: any) => a.order - b.order)
    })

    // Sort sections by order
    const sectionsArray = Object.values(sections)
      .sort((a: any, b: any) => a.order - b.order)

    console.log('Final sections array:', JSON.stringify(sectionsArray, null, 2))
    return NextResponse.json({ success: true, sections: sectionsArray })
  } catch (error: any) {
    console.error('Error fetching student materials:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Environment check:', {
      hasCustomKey: !!process.env.CUSTOM_AWS_ACCESS_KEY_ID,
      hasCustomSecret: !!process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
      region: 'ap-south-1',
      courseId: new URL(request.url).searchParams.get('courseId')
    })
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch materials',
      error: error.message,
      errorType: error.name
    }, { status: 500 })
  }
}