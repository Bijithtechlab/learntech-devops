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