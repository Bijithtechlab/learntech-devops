const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const sesClient = new SESClient({ region: 'ap-south-1' });
const dynamoClient = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Email is required'
        })
      };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store OTP in DynamoDB
    await docClient.send(new PutCommand({
      TableName: 'email-otps',
      Item: {
        email,
        otp,
        expiresAt,
        createdAt: new Date().toISOString()
      }
    }));

    // Send email via SES
    const emailParams = {
      Source: 'info@learntechlab.com',
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: 'Your learntechlab Registration Verification Code'
        },
        Body: {
          Html: {
            Data: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">learntechlab</h1>
                  <p style="color: #bfdbfe; margin: 10px 0 0 0;">Course Registration Verification</p>
                </div>
                
                <div style="padding: 40px 30px; background: white;">
                  <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email Address</h2>
                  
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Thank you for registering with learntechlab! Please use the verification code below to complete your registration:
                  </p>
                  
                  <div style="background: #f3f4f6; border: 2px dashed #d1d5db; padding: 20px; text-align: center; margin: 30px 0;">
                    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace;">
                      ${otp}
                    </div>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                    This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
                  </p>
                  
                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      © 2025 learntechlab. All rights reserved.<br>
                      Building Future-Ready Engineers
                    </p>
                  </div>
                </div>
              </div>
            `
          }
        }
      }
    };

    await sesClient.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'OTP sent successfully'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to send OTP',
        error: error.message
      })
    };
  }
};