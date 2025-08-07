const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { email } = event.queryStringParameters || {};

    if (!email) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, courses: [] })
      };
    }

    // Query course-registrations table for this email
    const result = await dynamodb.scan({
      TableName: 'course-registrations',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    const registrations = result.Items || [];
    const enrolledCourses = [];

    // Check each registration for completed payment
    registrations.forEach((registration) => {
      // Check both PaymentStatus and paymentStatus (case variations)
      const paymentStatus = registration.PaymentStatus || registration.paymentStatus;
      
      if (paymentStatus === 'completed' && registration.courseId) {
        enrolledCourses.push(registration.courseId);
      }
    });

    console.log(`Enrollments for ${email}:`, enrolledCourses);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, courses: enrolledCourses })
    };
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        courses: [],
        error: 'Failed to fetch enrollments',
        message: error.message 
      })
    };
  }
};