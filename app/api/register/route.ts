import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!
  }
})
const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.education) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Verify email address in SES first
    try {
      const { SESClient, VerifyEmailIdentityCommand } = require('@aws-sdk/client-ses')
      const sesClient = new SESClient({ 
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
        credentials: {
          accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!
        }
      })
      
      const verifyCommand = new VerifyEmailIdentityCommand({
        EmailAddress: body.email
      })
      
      await sesClient.send(verifyCommand)
      console.log('Email verification sent to:', body.email)
    } catch (error) {
      console.log('Email verification failed:', error.message)
    }

    const registrationData = {
      id: randomUUID(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      education: body.education,
      experience: body.experience || '',
      motivation: body.motivation || '',
      referredBy: body.referredBy || '',
      collegeName: body.collegeName || '',
      createdAt: new Date().toISOString(),
      PaymentStatus: 'pending',
      emailVerified: false
    }

    const command = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME || 'course-registrations',
      Item: registrationData
    })

    await docClient.send(command)
    console.log('Registration saved to DynamoDB:', registrationData.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Registration submitted successfully! Please check your email and verify your address. We will contact you soon.',
      id: registrationData.id
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit registration. Please try again.' },
      { status: 500 }
    )
  }
}