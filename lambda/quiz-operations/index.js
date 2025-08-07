const AWS = require('aws-sdk');
const { randomUUID } = require('crypto');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;
    const path = event.path;
    
    if (method === 'POST' && path.includes('/admin-quizzes')) {
      return await createQuiz(event);

    } else if (method === 'DELETE' && path.includes('/admin-quizzes')) {
      return await deleteQuiz(event);
    } else if (method === 'GET' && path.includes('/student-quiz/')) {
      return await getQuiz(event);
    } else if (method === 'POST' && path.includes('/quiz-attempt')) {
      return await saveQuizAttempt(event);
    } else if (method === 'GET' && path.includes('/quiz-attempt')) {
      return await getQuizAttempts(event);
    } else if (method === 'GET' && path.includes('/admin-quiz-questions')) {
      return await getQuizQuestions(event);
    } else if (method === 'POST' && path.includes('/admin-quiz-questions')) {
      return await createQuizQuestion(event);
    } else if (method === 'DELETE' && path.includes('/admin-quiz-questions')) {
      return await deleteQuizQuestion(event);
    }
    
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Not found' })
    };
    
  } catch (error) {
    console.error('Error in quiz Lambda:', error);
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

// Create quiz with questions in separate table
async function createQuiz(event) {
  const body = JSON.parse(event.body);
  const { 
    courseId, sectionId, title, description, order, timeLimit, 
    passingScore, maxAttempts, randomizeQuestions, isLocked, 
    questions, totalPoints 
  } = body;

  const quizId = randomUUID();

  // Store quiz metadata
  const quizMetadata = {
    id: quizId,
    courseId,
    sectionId,
    title,
    description,
    order,
    timeLimit,
    passingScore,
    maxAttempts,
    randomizeQuestions,
    isLocked,
    totalPoints,
    type: 'quiz',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: 'course-materials',
    Item: quizMetadata
  }).promise();

  // Store questions separately
  for (const question of questions) {
    const questionItem = {
      id: randomUUID(),
      quizId,
      courseId,
      sectionId,
      question: question.question,
      type: question.type,
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      points: question.points,
      explanation: question.explanation || '',
      createdAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: 'quiz-questions',
      Item: questionItem
    }).promise();
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, quiz: { ...quizMetadata, questions } })
  };
}

// Delete quiz and all questions
async function deleteQuiz(event) {
  const quizId = event.queryStringParameters?.id;

  if (!quizId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Quiz ID required' })
    };
  }

  // Delete quiz metadata
  await dynamodb.delete({
    TableName: 'course-materials',
    Key: { id: quizId }
  }).promise();

  // Get and delete all questions
  const questionsResult = await dynamodb.query({
    TableName: 'quiz-questions',
    IndexName: 'quiz-index',
    KeyConditionExpression: 'quizId = :quizId',
    ExpressionAttributeValues: { ':quizId': quizId }
  }).promise();

  for (const question of questionsResult.Items || []) {
    await dynamodb.delete({
      TableName: 'quiz-questions',
      Key: { id: question.id }
    }).promise();
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}

// Get quiz with questions for student
async function getQuiz(event) {
  const pathParts = event.path.split('/');
  const quizId = pathParts[pathParts.length - 1];

  // Get quiz metadata
  const quizResult = await dynamodb.get({
    TableName: 'course-materials',
    Key: { id: quizId }
  }).promise();

  if (!quizResult.Item || quizResult.Item.type !== 'quiz') {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Quiz not found' })
    };
  }

  // Get quiz questions
  const questionsResult = await dynamodb.query({
    TableName: 'quiz-questions',
    IndexName: 'quiz-index',
    KeyConditionExpression: 'quizId = :quizId',
    ExpressionAttributeValues: { ':quizId': quizId }
  }).promise();

  const formattedQuiz = {
    id: quizResult.Item.id,
    title: quizResult.Item.title,
    description: quizResult.Item.description,
    timeLimit: quizResult.Item.timeLimit,
    passingScore: quizResult.Item.passingScore,
    maxAttempts: quizResult.Item.maxAttempts,
    randomizeQuestions: quizResult.Item.randomizeQuestions,
    questions: questionsResult.Items || [],
    totalPoints: quizResult.Item.totalPoints
  };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, quiz: formattedQuiz })
  };
}

// Save quiz attempt
async function saveQuizAttempt(event) {
  const body = JSON.parse(event.body);
  const { quizId, email, answers, score, passed, timeSpent } = body;

  const attemptItem = {
    id: randomUUID(),
    quizId,
    email,
    answers,
    score,
    passed,
    timeSpent,
    attemptedAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: 'quiz-attempts',
    Item: attemptItem
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, attempt: attemptItem })
  };
}

// Get quiz attempts for a student and course
async function getQuizAttempts(event) {
  const { email, courseId } = event.queryStringParameters || {};

  if (!email || !courseId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Missing email or courseId' })
    };
  }

  try {
    // First get all quizzes for the course
    const quizzesResult = await dynamodb.scan({
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId AND #type = :type',
      ExpressionAttributeNames: { '#type': 'type' },
      ExpressionAttributeValues: {
        ':courseId': courseId,
        ':type': 'quiz'
      }
    }).promise();

    const courseQuizIds = (quizzesResult.Items || []).map(quiz => quiz.id);

    if (courseQuizIds.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          quizAttempts: []
        })
      };
    }

    // Get attempts for this user and filter by course quiz IDs
    const attemptsResult = await dynamodb.scan({
      TableName: 'quiz-attempts',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    const courseAttempts = (attemptsResult.Items || [])
      .filter(attempt => courseQuizIds.includes(attempt.quizId))
      .sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        quizAttempts: courseAttempts
      })
    };
  } catch (error) {
    console.error('Error in getQuizAttempts:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch quiz attempts',
        message: error.message
      })
    };
  }
}

// Get quiz questions
async function getQuizQuestions(event) {
  try {
    const quizId = event.queryStringParameters?.quizId;

    if (!quizId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Quiz ID required' })
      };
    }

    const result = await dynamodb.query({
      TableName: 'quiz-questions',
      IndexName: 'quiz-index',
      KeyConditionExpression: 'quizId = :quizId',
      ExpressionAttributeValues: { ':quizId': quizId }
    }).promise();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        questions: result.Items?.sort((a, b) => a.order - b.order) || []
      })
    };
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to fetch questions' })
    };
  }
}

// Create/Update quiz question
async function createQuizQuestion(event) {
  try {
    const questionData = JSON.parse(event.body);

    const question = {
      id: questionData.id || randomUUID(),
      quizId: questionData.quizId,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation,
      order: questionData.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: 'quiz-questions',
      Item: question
    }).promise();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, question })
    };
  } catch (error) {
    console.error('Error creating question:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to create question' })
    };
  }
}

// Delete quiz question
async function deleteQuizQuestion(event) {
  try {
    const questionId = event.queryStringParameters?.id;

    if (!questionId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Question ID required' })
      };
    }

    await dynamodb.delete({
      TableName: 'quiz-questions',
      Key: { id: questionId }
    }).promise();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error deleting question:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Failed to delete question' })
    };
  }
}
