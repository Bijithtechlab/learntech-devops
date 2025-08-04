const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    
    // Handle different trigger sources
    if (event.Records) {
      // DynamoDB Stream trigger
      for (const record of event.Records) {
        await handleStreamRecord(record);
      }
    } else if (event.email && event.courseId) {
      // Direct invocation
      await calculateAndUpdateProgress(event.email, event.courseId);
    } else if (event.action === 'migrate') {
      // Migration trigger
      await migrateAllStudentProgress();
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Progress updated successfully' })
    };
    
  } catch (error) {
    console.error('Error in progress calculator:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};

async function calculateAndUpdateProgress(email, courseId) {
  try {
    // Get student registration info
    const registration = await dynamodb.scan({
      TableName: 'course-registrations',
      FilterExpression: 'email = :email AND courseId = :courseId',
      ExpressionAttributeValues: {
        ':email': email,
        ':courseId': courseId
      }
    }).promise();
    
    if (!registration.Items || registration.Items.length === 0) {
  return;
    }
    
    const student = registration.Items[0];
    
    // Get completed materials
    const progressResult = await dynamodb.scan({
      TableName: 'student-progress',
      FilterExpression: 'email = :email AND courseId = :courseId',
      ExpressionAttributeValues: {
        ':email': email,
        ':courseId': courseId
      }
    }).promise();
    
    const completedMaterials = progressResult.Items || [];
    
    // Get total materials for course
    const materialsResult = await dynamodb.scan({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId AND (#type = :pdf OR #type = :quiz)',
      ExpressionAttributeNames: { '#type': 'type' },
      ExpressionAttributeValues: {
        ':courseId': courseId,
        ':pdf': 'pdf',
        ':quiz': 'quiz'
      }
    }).promise();
    
    const totalMaterials = materialsResult.Items || [];
    const progressPercentage = totalMaterials.length > 0 ? 
      Math.round((completedMaterials.length / totalMaterials.length) * 100) : 0;
    
    // Get quiz scores
    const quizAttemptsResult = await dynamodb.scan({
      TableName: 'quiz-attempts',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    }).promise();
    
    const quizAttempts = quizAttemptsResult.Items || [];
    const quizScores = [];
    
    for (const attempt of quizAttempts) {
      const quizResult = await dynamodb.get({
        TableName: 'course-materials',
        Key: { id: attempt.quizId }
      }).promise();
      
      if (quizResult.Item && quizResult.Item.courseId === courseId) {
        quizScores.push({
          quizTitle: quizResult.Item.title,
          score: attempt.score,
          totalPoints: quizResult.Item.totalPoints || 100,
          passed: attempt.passed,
          attemptedAt: attempt.attemptedAt
        });
      }
    }
    
    // Get last activity
    const lastActivity = completedMaterials.length > 0 ? 
      completedMaterials.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0].completedAt :
      null;
    
    // Update progress summary
    const summaryItem = {
      id: `${email}#${courseId}`,
      email: email,
      courseId: courseId,
      courseName: student.courseName || 'Unknown Course',
      firstName: student.firstName,
      lastName: student.lastName,
      collegeName: student.collegeName || 'Not specified',
      totalLessons: totalMaterials.length,
      completedLessons: completedMaterials.length,
      progressPercentage: progressPercentage,
      quizScores: quizScores,
      lastActivity: lastActivity,
      updatedAt: new Date().toISOString()
    };
    
    await dynamodb.put({
      TableName: 'student-progress-summary',
      Item: summaryItem
    }).promise();
    

    
  } catch (error) {
    console.error(`Error calculating progress for ${email}:`, error);
    throw error;
  }
}

async function migrateAllStudentProgress() {
const registrations = await dynamodb.scan({
    TableName: 'course-registrations'
  }).promise();
  
  for (const registration of registrations.Items || []) {
    if (registration.courseId) {
      await calculateAndUpdateProgress(registration.email, registration.courseId);
    }
  }
}