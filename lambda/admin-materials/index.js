const AWS = require('aws-sdk');
const { randomUUID } = require('crypto');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const BUCKET_NAME = 'learntechlab-course-materials';

exports.handler = async (event) => {
  try {
    const method = event.httpMethod;
    const path = event.path;
    
    // Route to appropriate handler based on method and path
    if (method === 'GET' && path.includes('/admin-materials')) {
      return await getCourseMaterials(event);
    } else if (method === 'POST' && path.includes('/admin-sections')) {
      return await createSection(event);
    } else if (method === 'PUT' && path.includes('/admin-sections')) {
      return await updateSection(event);
    } else if (method === 'DELETE' && path.includes('/admin-sections')) {
      return await deleteSection(event);
    } else if (method === 'POST' && path.includes('/admin-subsections')) {
      return await createSubSection(event);
    } else if (method === 'PUT' && path.includes('/admin-subsections')) {
      return await updateSubSection(event);
    } else if (method === 'DELETE' && path.includes('/admin-subsections')) {
      return await deleteSubSection(event);
    }
    
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Not found' })
    };
    
  } catch (error) {
    console.error('Error in admin-materials Lambda:', error);
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

// Get course materials (same as student but for admin)
async function getCourseMaterials(event) {
  const courseId = event.queryStringParameters?.courseId;
  
  if (!courseId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Course ID required' })
    };
  }

  const params = {
    TableName: 'course-materials',
    FilterExpression: 'courseId = :courseId',
    ExpressionAttributeValues: { ':courseId': courseId }
  };

  const result = await dynamodb.scan(params).promise();
  
  // Group by sections, subsections, and materials
  const sections = {};
  const subSections = {};
  const materials = [];
  const quizzes = [];
  
  for (const item of result.Items || []) {
    if (item.type === 'section') {
      sections[item.id] = {
        id: item.id,
        title: item.title,
        description: item.description,
        order: item.order,
        subSections: [],
        quizzes: [],
        courseId: item.courseId
      };
    } else if (item.type === 'subsection') {
      if (!subSections[item.sectionId]) {
        subSections[item.sectionId] = [];
      }
      subSections[item.sectionId].push({
        id: item.id,
        title: item.title,
        description: item.description,
        order: item.order,
        sectionId: item.sectionId,
        materials: []
      });
    } else if (item.type === 'pdf' && item.subSectionId) {
      let signedUrl = item.pdfUrl;
      if (item.s3Key) {
        try {
          signedUrl = s3.getSignedUrl('getObject', {
            Bucket: BUCKET_NAME,
            Key: item.s3Key,
            Expires: 3600
          });
        } catch (error) {
          console.error('Error generating signed URL:', error);
        }
      }
      
      materials.push({
        ...item,
        pdfUrl: signedUrl
      });
    } else if (item.type === 'quiz') {
      quizzes.push({
        id: item.id,
        title: item.title,
        description: item.description,
        order: item.order,
        isLocked: item.isLocked,
        estimatedTime: item.estimatedTime,
        sectionId: item.sectionId
      });
    }
  }
  
  // Attach materials to subsections
  materials.forEach(material => {
    Object.keys(subSections).forEach(sectionId => {
      const sectionSubSections = subSections[sectionId];
      const targetSubSection = sectionSubSections.find(ss => ss.id === material.subSectionId);
      if (targetSubSection) {
        targetSubSection.materials.push(material);
      }
    });
  });
  
  // Attach subsections to sections
  Object.keys(subSections).forEach(sectionId => {
    if (sections[sectionId]) {
      sections[sectionId].subSections = subSections[sectionId].sort((a, b) => a.order - b.order);
    }
  });
  
  // Attach quizzes to sections
  quizzes.forEach(quiz => {
    if (sections[quiz.sectionId]) {
      sections[quiz.sectionId].quizzes.push(quiz);
    }
  });
  
  // Sort quizzes within each section
  Object.values(sections).forEach(section => {
    section.quizzes.sort((a, b) => a.order - b.order);
  });

  const sectionsArray = Object.values(sections).sort((a, b) => a.order - b.order);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, sections: sectionsArray })
  };
}

// Create section
async function createSection(event) {
  const body = JSON.parse(event.body);
  const { courseId, title, description, order } = body;

  const sectionItem = {
    id: randomUUID(),
    courseId,
    title,
    description,
    order,
    type: 'section',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: 'course-materials',
    Item: sectionItem
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, section: sectionItem })
  };
}

// Update section
async function updateSection(event) {
  const body = JSON.parse(event.body);
  const { id, courseId, title, description, order } = body;

  await dynamodb.update({
    TableName: 'course-materials',
    Key: { id },
    UpdateExpression: 'SET title = :title, description = :description, #order = :order, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#order': 'order' },
    ExpressionAttributeValues: {
      ':title': title,
      ':description': description,
      ':order': order,
      ':updatedAt': new Date().toISOString()
    }
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}

// Delete section
async function deleteSection(event) {
  const sectionId = event.queryStringParameters?.id;

  // Delete section and all related items
  const params = {
    TableName: 'course-materials',
    FilterExpression: 'id = :sectionId OR sectionId = :sectionId',
    ExpressionAttributeValues: { ':sectionId': sectionId }
  };

  const result = await dynamodb.scan(params).promise();
  
  for (const item of result.Items || []) {
    await dynamodb.delete({
      TableName: 'course-materials',
      Key: { id: item.id }
    }).promise();
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}

// Create subsection
async function createSubSection(event) {
  const body = JSON.parse(event.body);
  const { courseId, sectionId, title, description, order } = body;

  const subSectionItem = {
    id: randomUUID(),
    courseId,
    sectionId,
    title,
    description,
    order,
    type: 'subsection',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await dynamodb.put({
    TableName: 'course-materials',
    Item: subSectionItem
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, subSection: subSectionItem })
  };
}

// Update subsection
async function updateSubSection(event) {
  const body = JSON.parse(event.body);
  const { id, courseId, sectionId, title, description, order } = body;

  await dynamodb.update({
    TableName: 'course-materials',
    Key: { id },
    UpdateExpression: 'SET title = :title, description = :description, #order = :order, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#order': 'order' },
    ExpressionAttributeValues: {
      ':title': title,
      ':description': description,
      ':order': order,
      ':updatedAt': new Date().toISOString()
    }
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}

// Delete subsection
async function deleteSubSection(event) {
  const subSectionId = event.queryStringParameters?.id;

  // Delete subsection and all related materials
  const params = {
    TableName: 'course-materials',
    FilterExpression: 'id = :subSectionId OR subSectionId = :subSectionId',
    ExpressionAttributeValues: { ':subSectionId': subSectionId }
  };

  const result = await dynamodb.scan(params).promise();
  
  for (const item of result.Items || []) {
    await dynamodb.delete({
      TableName: 'course-materials',
      Key: { id: item.id }
    }).promise();
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
}