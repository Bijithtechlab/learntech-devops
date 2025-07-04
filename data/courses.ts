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
    title: 'AI Powered Software Development, DevOps & Cloud',
    shortTitle: 'AI DevOps & Cloud',
    description: 'Master AI-Powered Software Development, DevOps, and Cloud Technologies with comprehensive hands-on training. Become a Future-Ready Engineer.',
    duration: '3 months',
    price: 14999,
    level: 'Intermediate',
    category: 'Technology',
    features: ['Live Sessions', 'Hands-on Projects', 'AI Integration', 'Cloud Deployment', 'Career Support'],
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
    status: 'active'
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
    status: 'active'
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