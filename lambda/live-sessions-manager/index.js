const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters, queryStringParameters, body } = event;
    
    console.log('Event:', JSON.stringify(event, null, 2));

    switch (httpMethod) {
      case 'GET':
        return await getSessions(queryStringParameters);
      case 'POST':
        return await createSession(JSON.parse(body || '{}'));
      case 'PUT':
        return await updateSession(pathParameters?.sessionId, JSON.parse(body || '{}'));
      case 'DELETE':
        return await deleteSession(pathParameters?.sessionId);
      default:
        return {
          statusCode: 405,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

async function getSessions(queryStringParameters) {
  const courseId = queryStringParameters?.courseId;

  let params = {
    TableName: 'lms-live-sessions'
  };

  if (courseId) {
    params = {
      TableName: 'lms-live-sessions',
      IndexName: 'course-index',
      KeyConditionExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId
      }
    };
    const result = await dynamodb.query(params).promise();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, sessions: result.Items || [] })
    };
  } else {
    const result = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, sessions: result.Items || [] })
    };
  }
}

async function createSession(data) {
  const {
    courseId,
    title,
    description,
    instructorName,
    scheduledDate,
    duration,
    zoomMeetingId,
    zoomJoinUrl,
    zoomPassword,
    maxParticipants
  } = data;

  const sessionId = uuidv4();
  const session = {
    id: sessionId,
    courseId,
    title,
    description,
    instructorName,
    scheduledDate,
    duration: parseInt(duration),
    zoomMeetingId,
    zoomJoinUrl,
    zoomPassword,
    maxParticipants: parseInt(maxParticipants),
    enrolledStudents: [],
    status: 'scheduled',
    recordingUrl: data.recordingUrl || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: 'lms-live-sessions',
    Item: session
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, session })
  };
}

async function updateSession(sessionId, data) {
  if (!sessionId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Session ID required' })
    };
  }

  const updateExpression = [];
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};

  Object.keys(data).forEach(key => {
    if (key !== 'id') {
      updateExpression.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      if (key === 'duration' || key === 'maxParticipants') {
        expressionAttributeValues[`:${key}`] = parseInt(data[key]) || data[key];
      } else {
        expressionAttributeValues[`:${key}`] = data[key];
      }
    }
  });

  expressionAttributeValues[':updatedAt'] = new Date().toISOString();
  updateExpression.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';

  await dynamodb.update({
    TableName: 'lms-live-sessions',
    Key: { id: sessionId },
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}

async function deleteSession(sessionId) {
  if (!sessionId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Session ID required' })
    };
  }

  await dynamodb.delete({
    TableName: 'lms-live-sessions',
    Key: { id: sessionId }
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}