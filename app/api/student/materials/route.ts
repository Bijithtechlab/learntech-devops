import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
const dynamoClient = new DynamoDBClient({ 
  region: 'ap-south-1',
  credentials: process.env.CUSTOM_AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY!
  } : undefined
})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

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
        materials.push({
          ...item,
          pdfUrl: item.pdfUrl
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
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch materials'
    }, { status: 500 })
  }
}