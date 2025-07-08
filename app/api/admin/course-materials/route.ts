import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)
const s3Client = new S3Client({ region: 'ap-south-1' })

const BUCKET_NAME = 'learntechlab-course-materials'

// GET - Fetch course materials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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
          materials: subSection.materials.sort((a: any, b: any) => a.order - b.order)
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

// POST - Create/Update course material
export async function POST(request: NextRequest) {
  try {
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
    console.error('Error creating material:', error)
    return NextResponse.json({ success: false, message: 'Failed to create material' }, { status: 500 })
  }
}

// DELETE - Remove course material
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('id')
    const s3Key = searchParams.get('s3Key')

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
    console.error('Error deleting material:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete material' }, { status: 500 })
  }
}