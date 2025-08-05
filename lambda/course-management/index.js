const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { httpMethod, path } = event;
    
    // Admin course management endpoint
    if (path && path.includes('admin-courses')) {
      return await handleAdminCourses(event);
    }
    
    // Public courses endpoint
    if (httpMethod === 'GET') {
      return await getCourses();
    }
    
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
    
  } catch (error) {
    console.error('Error in course management:', error);
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

async function getCourses() {
  try {
    const params = {
      TableName: 'learntechCourse'
    };

    const result = await dynamodb.scan(params).promise();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        courses: result.Items || []
      })
    };
  } catch (error) {
    throw error;
  }
}

async function handleAdminCourses(event) {
  const { httpMethod, body } = event;
  
  try {
    if (httpMethod === 'POST') {
      return await createCourse(JSON.parse(body));
    } else if (httpMethod === 'PUT') {
      return await updateCourse(JSON.parse(body));
    } else if (httpMethod === 'DELETE') {
      const courseId = event.queryStringParameters?.courseId;
      return await deleteCourse(courseId);
    }
    
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  } catch (error) {
    throw error;
  }
}

async function createCourse(courseData) {
  const params = {
    TableName: 'learntechCourse',
    Item: {
      ...courseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  await dynamodb.put(params).promise();
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}

async function updateCourse(courseData) {
  console.log('Updating course with data:', JSON.stringify(courseData, null, 2));
  
  const params = {
    TableName: 'learntechCourse',
    Item: {
      ...courseData,
      updatedAt: new Date().toISOString()
    }
  };

  console.log('DynamoDB put params:', JSON.stringify(params, null, 2));
  await dynamodb.put(params).promise();
  console.log('Course updated successfully in DynamoDB');
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}

async function deleteCourse(courseId) {
  if (!courseId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Course ID is required' })
    };
  }

  const params = {
    TableName: 'learntechCourse',
    Key: { courseId }
  };

  await dynamodb.delete(params).promise();
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}