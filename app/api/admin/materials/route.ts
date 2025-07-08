import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)
const s3Client = new S3Client({ region: 'ap-south-1' })

const BUCKET_NAME = 'learntechlab-course-materials'

// POST - Create material
export async function POST(request: NextRequest) {
  try {
    console.log('Material creation request received')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const materialData = JSON.parse(formData.get('materialData') as string)
    
    console.log('Material data:', materialData)
    console.log('File:', file?.name)

    let s3Key = ''
    let pdfUrl = ''

    // Upload PDF to S3
    if (file && file.size > 0) {
      s3Key = `${materialData.courseId}/materials/${randomUUID()}-${file.name}`
      
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: 'application/pdf'
      })

      await s3Client.send(uploadCommand)
      pdfUrl = `https://${BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${s3Key}`
    }

    // Save material to DynamoDB
    const material = {
      id: randomUUID(),
      courseId: materialData.courseId,
      subSectionId: materialData.subSectionId,
      title: materialData.title,
      description: materialData.description,
      type: 'pdf',
      order: materialData.order,
      isLocked: materialData.isLocked || false,
      estimatedTime: materialData.estimatedTime,
      s3Key: s3Key,
      pdfUrl: pdfUrl,
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

// DELETE - Remove material
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