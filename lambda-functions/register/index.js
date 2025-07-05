const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

const client = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // Enhanced validation
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.education || !body.courseId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields'
        })
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid email format'
        })
      };
    }

    // Phone validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(body.phone.replace(/\D/g, ''))) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid phone number format'
        })
      };
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
      courseId: body.courseId,
      courseName: body.courseName || 'Unknown Course',
      createdAt: new Date().toISOString(),
      PaymentStatus: 'pending',
      emailVerified: body.emailVerified || false
    };

    const command = new PutCommand({
      TableName: 'course-registrations',
      Item: registrationData
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Registration submitted successfully!',
        id: registrationData.id
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to submit registration',
        error: error.message
      })
    };
  }
};