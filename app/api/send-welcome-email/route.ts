import { NextRequest, NextResponse } from 'next/server'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { randomBytes } from 'crypto'

const sesClient = new SESClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!
  }
})

const dynamoClient = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!
  }
})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

function generatePassword() {
  return randomBytes(8).toString('hex').slice(0, 12)
}

function createEmailTemplate(firstName: string, lastName: string, email: string, password: string) {
  return {
    Subject: {
      Data: 'Welcome to LearnTechLab - Your Student Portal Access',
      Charset: 'UTF-8'
    },
    Body: {
      Html: {
        Data: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to LearnTechLab!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">AI Powered SW Development, DevOps & Cloud Program</p>
            </div>
            
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #1e293b; margin-bottom: 20px;">Hello ${firstName} ${lastName},</h2>
              
              <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                Congratulations! Your payment has been confirmed and you now have full access to our comprehensive 
                AI Powered Software Development, DevOps & Cloud training program.
              </p>
              
              <div style="background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #2563eb; margin: 25px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Your Student Portal Access:</h3>
                <p style="margin: 10px 0;"><strong>Portal URL:</strong> <a href="https://learntechlab.com/student" style="color: #2563eb;">https://learntechlab.com/student</a></p>
                <p style="margin: 10px 0;"><strong>Username:</strong> ${email}</p>
                <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 14px;">
                <p><strong>Need Help?</strong></p>
                <p>Contact us at: info@learntechlab.com</p>
              </div>
            </div>
          </div>
        `,
        Charset: 'UTF-8'
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, email, firstName, lastName } = await request.json()
    
    if (!studentId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate password
    const password = generatePassword()
    
    // Create user account
    const userData = {
      id: studentId,
      email: email,
      password: password,
      role: 'student',
      name: `${firstName} ${lastName}`,
      createdAt: new Date().toISOString()
    }
    
    const putCommand = new PutCommand({
      TableName: process.env.USERS_TABLE_NAME || 'users',
      Item: userData
    })
    
    await docClient.send(putCommand)
    console.log('Student account created:', email)
    
    // Send welcome email
    const emailParams = {
      Source: 'info@learntechlab.com',
      Destination: {
        ToAddresses: [email]
      },
      Message: createEmailTemplate(firstName, lastName, email, password)
    }
    
    const sendCommand = new SendEmailCommand(emailParams)
    await sesClient.send(sendCommand)
    console.log('Welcome email sent to:', email)

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully'
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send welcome email' },
      { status: 500 }
    )
  }
}