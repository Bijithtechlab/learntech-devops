const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: 'ap-south-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

const courses = [
  {
    courseId: 'ai-devops-cloud',
    title: 'Complete AI Developer Journey - AI Project Management, Cloud, GenAI & Vibe Coding',
    shortTitle: 'AI, Cloud & GenAI',
    description: 'This course, "Complete AI Developer Journey - AI Project Management, Cloud, GenAI & Vibe Coding," is designed to equip you with a comprehensive skill set for contemporary software development. It covers a wide array of essential topics, starting with Agile Project Management using Jira, where you\'ll learn about Agile principles, benefits, processes, and how to effectively use Jira for team-managed projects, issue creation, and configuring Agile boards.',
    duration: '4 months',
    price: 49999,
    level: 'Intermediate',
    category: 'Technology',
    features: ['Live Sessions', 'Hands-on Projects', 'AI Integration', 'Cloud Deployment'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'smart-coding-revolution',
    title: 'Smart Coding Revolution - AI Assisted Full-Stack Development',
    shortTitle: 'Smart Coding Revolution',
    description: 'Master the art of building full-stack applications using AI assistance and modern development tools. This intensive course covers Web Development Fundamentals including HTML, CSS, and JavaScript, followed by Vibe Coding with Next.js where you\'ll learn TypeScript, React components, hooks, and API development without getting bogged down in complex syntax.',
    duration: '10 days',
    price: 9999,
    level: 'Beginner',
    category: 'Technology',
    features: ['AI-Assisted Coding', 'Full-Stack Project', 'No Complex Coding', 'PWA Development', 'Live Deployment'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'pmp-certification',
    title: 'Project Management Professional - PMP',
    shortTitle: 'PMP Certification',
    description: 'Comprehensive PMP certification training with exam preparation and real-world project management skills.',
    duration: '8 weeks',
    price: 9999,
    level: 'Intermediate',
    category: 'Management',
    features: ['PMP Exam Prep', 'PMI PDUs', '35 Contact Hours', 'Mock Exams', 'Study Materials'],
    status: 'coming-soon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'cpmai-certification',
    title: 'Cognitive Project Management for AI - CPMAI',
    shortTitle: 'CPMAI Certification',
    description: 'Specialized certification for managing AI projects with cognitive project management methodologies.',
    duration: '6 weeks',
    price: 20000,
    level: 'Advanced',
    category: 'Management',
    features: ['AI Project Management', 'CPMAI Certification', 'Case Studies', 'Industry Best Practices'],
    status: 'coming-soon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'networking-linux',
    title: 'Networking & Linux',
    shortTitle: 'Networking & Linux',
    description: 'Master networking fundamentals and Linux system administration for IT infrastructure management.',
    duration: '10 weeks',
    price: 14999,
    level: 'Beginner',
    category: 'Technology',
    features: ['Network Protocols', 'Linux Administration', 'Security Basics', 'Hands-on Labs'],
    status: 'coming-soon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'aws-ai-practitioner',
    title: 'AWS - AI Practitioner',
    shortTitle: 'AWS AI Practitioner',
    description: 'AWS AI services and machine learning implementation for cloud-based AI solutions.',
    duration: '8 weeks',
    price: 13999,
    level: 'Intermediate',
    category: 'Cloud',
    features: ['AWS AI Services', 'Machine Learning', 'SageMaker', 'Certification Prep'],
    status: 'coming-soon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'jira-agile',
    title: 'Jira Fundamentals - Agile Project Management',
    shortTitle: 'Jira & Agile',
    description: 'Master Jira for agile project management, scrum workflows, and team collaboration.',
    duration: '4 weeks',
    price: 4999,
    level: 'Beginner',
    category: 'Management',
    features: ['Jira Administration', 'Agile Workflows', 'Scrum & Kanban', 'Reporting & Analytics'],
    status: 'coming-soon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function seedCourses() {
  try {
    for (const course of courses) {
      const params = {
        TableName: 'learntechCourse',
        Item: course
      };

      await dynamodb.put(params).promise();
      console.log(`Seeded course: ${course.title}`);
    }
    
    console.log('All courses seeded successfully!');
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
}

seedCourses();