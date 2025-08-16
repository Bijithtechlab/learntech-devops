const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-south-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const BUCKET_NAME = 'learntechlab-course-materials';

// Helper function for CORS headers
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

exports.handler = async (event) => {
  try {
    const courseId = event.queryStringParameters?.courseId;
    
    if (!courseId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: 'Course ID required' })
      };
    }

    // Scan DynamoDB for course materials
    const params = {
      TableName: 'course-materials',
      FilterExpression: 'courseId = :courseId',
      ExpressionAttributeValues: { ':courseId': courseId }
    };

    const result = await dynamodb.scan(params).promise();
    
    // Group by sections, subsections, materials, and videos
    const sections = {};
    const subSections = {};
    const materials = [];
    const videos = [];
    const quizzes = [];
    
    for (const item of result.Items || []) {
      if (item.type === 'section') {
        sections[item.id] = {
          id: item.id,
          title: item.title,
          description: item.description,
          order: item.order,
          subSections: [],
          quizzes: []
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
        // Generate signed URL for PDF access
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
      } else if (item.type === 'video' && item.subSectionId) {
        videos.push(item);
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
    
    // Attach videos to subsections
    videos.forEach(video => {
      Object.keys(subSections).forEach(sectionId => {
        const sectionSubSections = subSections[sectionId];
        const targetSubSection = sectionSubSections.find(ss => ss.id === video.subSectionId);
        if (targetSubSection) {
          targetSubSection.video = video;
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

    // Sort sections by order
    const sectionsArray = Object.values(sections).sort((a, b) => a.order - b.order);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, sections: sectionsArray })
    };
    
  } catch (error) {
    console.error('Error fetching student materials:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to fetch materials',
        error: error.message 
      })
    };
  }
};