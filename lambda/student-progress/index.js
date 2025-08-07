const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const path = event.path || event.resource;
    
    // Admin endpoint to get all students progress
    if (path && path.includes('admin-student-progress')) {
      return await getAdminStudentProgress();
    }
    
    // Student completion checking endpoints
    if (path && path.includes('student-completed-materials')) {
      return await getCompletedMaterials(event);
    }
    
    if (path && path.includes('student-check-completion')) {
      return await checkCompletion(event);
    }
    
    const { email, courseId } = event.queryStringParameters || {};

    if (!email || !courseId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Missing email or courseId' })
      };
    }

    // Get completed materials
    const progressParams = {
      TableName: 'student-progress',
      FilterExpression: 'email = :email AND courseId = :courseId',
      ExpressionAttributeValues: {
        ':email': email,
        ':courseId': courseId
      }
    };

    const progressResult = await dynamodb.scan(progressParams).promise();
    const completedMaterials = progressResult.Items || [];
    const completedCount = completedMaterials.length;

    // Get total materials for the course (PDFs + Quizzes)
    const materialsParams = {
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId AND (#type = :pdf OR #type = :quiz)',
      ExpressionAttributeNames: {
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':courseId': courseId,
        ':pdf': 'pdf',
        ':quiz': 'quiz'
      }
    };

    const materialsResult = await dynamodb.scan(materialsParams).promise();
    const totalMaterials = materialsResult.Items || [];
    const totalCount = totalMaterials.length;

    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        progress: {
          courseId: courseId,
          totalLessons: totalCount,
          completedLessons: completedCount,
          progressPercentage: progressPercentage
        },
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

// Get completed materials for a student and course
async function getCompletedMaterials(event) {
  try {
    const { email, courseId } = event.queryStringParameters || {};

    if (!email || !courseId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Email and courseId required' })
      };
    }

    // Get all materials for the course
    const materialsResult = await dynamodb.scan({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId AND #type = :type',
      ExpressionAttributeNames: { '#type': 'type' },
      ExpressionAttributeValues: { 
        ':courseId': courseId,
        ':type': 'pdf'
      }
    }).promise();

    const courseMaterialIds = materialsResult.Items?.map(item => item.id) || [];

    // Get completed materials for the user
    const completedResult = await dynamodb.scan({
      TableName: 'student-progress',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { 
        ':email': email
      }
    }).promise();
    
    // Filter completed materials that belong to this course
    const completedMaterials = completedResult.Items
      ?.filter(item => courseMaterialIds.includes(item.materialId))
      ?.map(item => item.materialId) || [];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        completedMaterials
      })
    };
  } catch (error) {
    console.error('Error fetching completed materials:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to fetch completed materials' })
    };
  }
}

// Check if a specific material is completed
async function checkCompletion(event) {
  try {
    const { email, materialId } = event.queryStringParameters || {};

    if (!email || !materialId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Email and materialId required' })
      };
    }

    const result = await dynamodb.query({
      TableName: 'student-progress',
      IndexName: 'email-material-index',
      KeyConditionExpression: 'email = :email AND materialId = :materialId',
      ExpressionAttributeValues: {
        ':email': email,
        ':materialId': materialId
      }
    }).promise();

    const completed = (result.Items?.length || 0) > 0;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, completed })
    };
  } catch (error) {
    console.error('Error checking completion:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to check completion' })
    };
  }
}

// Get all students progress for admin from summary table
async function getAdminStudentProgress() {
  try {
    // Get all progress summaries
    const summariesResult = await dynamodb.scan({
      TableName: 'student-progress-summary'
    }).promise();
    
    const students = summariesResult.Items || [];
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        students: students
      })
    };
    
  } catch (error) {
    console.error('Error fetching admin student progress:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch admin student progress',
        message: error.message 
      })
    };
  }
}