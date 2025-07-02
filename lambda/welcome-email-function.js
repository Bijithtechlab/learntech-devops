const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb')
const { randomBytes } = require('crypto')

const sesClient = new SESClient({ region: 'ap-south-1' })
const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' })
const docClient = DynamoDBDocumentClient.from(dynamoClient)

// Generate secure random password
function generatePassword() {
  return randomBytes(8).toString('hex').slice(0, 12)
}

// Create email template
function createEmailTemplate(firstName, lastName, email, password) {
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
              
              <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; margin: 25px 0;">
                <h3 style="color: #065f46; margin-top: 0;">What's Next?</h3>
                <ul style="color: #047857; margin: 0; padding-left: 20px;">
                  <li>Access your course materials and modules</li>
                  <li>Complete assignments and quizzes</li>
                  <li>Track your learning progress</li>
                  <li>Get mentorship support from our expert trainers</li>
                </ul>
              </div>
              
              <p style="color: #475569; line-height: 1.6; margin: 25px 0;">
                Our expert trainers, Vinod Kumar (39+ years experience) and Bijith Meethale Kondayattu (PMP®, CPMAI®), 
                are here to guide you through your journey to becoming a Future-Ready Engineer.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://learntechlab.com/student" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Access Student Portal
                </a>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 14px;">
                <p><strong>Need Help?</strong></p>
                <p>Contact us at: info@learntechlab.com</p>
                <p>We're here to support your learning journey!</p>
              </div>
            </div>
          </div>
        `,
        Charset: 'UTF-8'
      }
    }
  }
}

exports.handler = async (event) => {
  try {
    const { studentId, email, firstName, lastName } = event
    
    // Generate password
    const password = generatePassword()
    
    // Create user account
    const userData = {
      id: studentId,
      email: email,
      password: password, // In production, hash this password
      role: 'student',
      name: `${firstName} ${lastName}`,
      createdAt: new Date().toISOString()
    }
    
    const putCommand = new PutCommand({
      TableName: 'users',
      Item: userData
    })
    
    await docClient.send(putCommand)
    
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
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Welcome email sent successfully'
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Failed to send welcome email'
      })
    }
  }
}