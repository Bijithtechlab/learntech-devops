const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { email, courseId } = event.queryStringParameters || {};

    if (!email || !courseId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Missing email or courseId' })
      };
    }

    const params = {
      TableName: 'student-progress',
      FilterExpression: 'email = :email AND courseId = :courseId',
      ExpressionAttributeValues: {
        ':email': email,
        ':courseId': courseId
      }
    };

    const result = await dynamodb.scan(params).promise();
    
    const completedMaterials = result.Items || [];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        completedMaterials: completedMaterials.map(item => item.materialId)
      })
    };
    
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch progress',
        message: error.message 
      })
    };
  }
};