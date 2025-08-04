const AWS = require('aws-sdk');
const { randomUUID } = require('crypto');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, courseId, materialId } = body;

    if (!email || !courseId || !materialId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Missing required fields' })
      };
    }

    const progressItem = {
      id: randomUUID(),
      email,
      courseId,
      materialId,
      completedAt: new Date().toISOString()
    };

    const params = {
      TableName: 'student-progress',
      Item: progressItem,
      ConditionExpression: 'attribute_not_exists(id)'
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
    
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to mark lesson complete',
        message: error.message 
      })
    };
  }
};