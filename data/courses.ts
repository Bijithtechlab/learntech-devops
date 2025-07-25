export interface Course {
  id: string
  title: string
  shortTitle: string
  description: string
  duration: string
  price: number
  level: string
  category: string
  features: string[]
  status: 'active' | 'coming-soon'
}

export const courses: Course[] = [
  {
    id: 'ai-devops-cloud',
    title: 'AI Powered Software Development - Cloud, Generative AI, & Vibe Coding',
    shortTitle: 'AI, Cloud & GenAI',
    description: 'This course, "AI Powered Software Development - Cloud, Generative AI, & Vibe Coding," is designed to equip you with a comprehensive skill set for contemporary software development. It covers a wide array of essential topics, starting with <strong>Agile Project Management using Jira</strong>, where you\'ll learn about Agile principles, benefits, processes, and how to effectively use Jira for team-managed projects, issue creation, and configuring Agile boards.\nYou will delve into <strong>Programming with Python</strong>, covering fundamental concepts from variables and operators to functions, data structures, JSON, and YAML. The course also provides a solid foundation in <strong>Git for Version Control</strong>, including installation, repository initialization, committing changes, exploring history, branching, merging, and working with remote repositories like GitHub.\nA significant portion of the course focuses on <strong>AWS Cloud</strong>, introducing you to cloud computing, various AWS services such as EC2, EBS, S3, and databases like DynamoDB. It extensively covers <strong>Generative AI (GenAI)</strong> concepts, <strong>Amazon Bedrock</strong>, <strong>prompt engineering techniques</strong>, and <strong>Amazon Q</strong>. You\'ll also explore the broader landscape of <strong>Artificial Intelligence (AI) and Machine Learning (ML)</strong>, including different learning types, model evaluation, and various AWS Managed AI Services like Amazon Comprehend, Translate, Transcribe, and Rekognition.\nFurthermore, the curriculum includes <strong>Application Development with Next.js</strong>, teaching important concepts like React, components, state, hooks, Next.js structure, routing, and APIs. A key highlight is the section on <strong>Vibe Coding with GitHub Copilot</strong>, demonstrating how this AI-driven assistant can transform your coding experience through code generation, chat interaction, and assistance in various languages like JavaScript, TypeScript, Python, and React, including test writing and data visualization. Finally, you\'ll learn to build <strong>Full-Stack Applications with no-code methods</strong>, covering project requirement documentation, creating Next.js projects, setting up backend authentication, working with DynamoDB, implementing database functionality, and deploying applications using a CI/CD pipeline to AWS Amplify',
    duration: '4 months',
    price: 14999,
    level: 'Intermediate',
    category: 'Technology',
    features: ['Live Sessions', 'Hands-on Projects', 'AI Integration', 'Cloud Deployment'],
    status: 'active'
  },
  {
    id: 'pmp-certification',
    title: 'Project Management Professional - PMP',
    shortTitle: 'PMP Certification',
    description: 'Comprehensive PMP certification training with exam preparation and real-world project management skills.',
    duration: '8 weeks',
    price: 12999,
    level: 'Intermediate',
    category: 'Management',
    features: ['PMP Exam Prep', 'PMI PDUs', '35 Contact Hours', 'Mock Exams', 'Study Materials'],
    status: 'coming-soon'
  },
  {
    id: 'cpmai-certification',
    title: 'Cognitive Project Management for AI - CPMAI',
    shortTitle: 'CPMAI Certification',
    description: 'Specialized certification for managing AI projects with cognitive project management methodologies.',
    duration: '6 weeks',
    price: 9999,
    level: 'Advanced',
    category: 'Management',
    features: ['AI Project Management', 'CPMAI Certification', 'Case Studies', 'Industry Best Practices'],
    status: 'coming-soon'
  },
  {
    id: 'networking-linux',
    title: 'Networking & Linux',
    shortTitle: 'Networking & Linux',
    description: 'Master networking fundamentals and Linux system administration for IT infrastructure management.',
    duration: '10 weeks',
    price: 11999,
    level: 'Beginner',
    category: 'Technology',
    features: ['Network Protocols', 'Linux Administration', 'Security Basics', 'Hands-on Labs'],
    status: 'coming-soon'
  },
  {
    id: 'aws-ai-practitioner',
    title: 'AWS - AI Practitioner',
    shortTitle: 'AWS AI Practitioner',
    description: 'AWS AI services and machine learning implementation for cloud-based AI solutions.',
    duration: '8 weeks',
    price: 13999,
    level: 'Intermediate',
    category: 'Cloud',
    features: ['AWS AI Services', 'Machine Learning', 'SageMaker', 'Certification Prep'],
    status: 'coming-soon'
  },
  {
    id: 'jira-agile',
    title: 'Jira Fundamentals - Agile Project Management',
    shortTitle: 'Jira & Agile',
    description: 'Master Jira for agile project management, scrum workflows, and team collaboration.',
    duration: '4 weeks',
    price: 7999,
    level: 'Beginner',
    category: 'Management',
    features: ['Jira Administration', 'Agile Workflows', 'Scrum & Kanban', 'Reporting & Analytics'],
    status: 'coming-soon'
  }
]

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id)
}

export function getActiveCourses(): Course[] {
  return courses.filter(course => course.status === 'active')
}

export function getCoursesByCategory(category: string): Course[] {
  return courses.filter(course => course.category === category)
}