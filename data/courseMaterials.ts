export interface CourseMaterial {
  id: string
  title: string
  description: string
  type: 'pdf' | 'quiz'
  sectionId: string
  sectionTitle: string
  order: number
  pdfUrl?: string
  quizId?: string
  isLocked: boolean
  estimatedTime?: string
}

export interface CourseSection {
  id: string
  title: string
  description: string
  order: number
  materials: CourseMaterial[]
}

// Sample course materials for AI DevOps Cloud course
export const aiDevOpsCourseMaterials: CourseSection[] = [
  {
    id: 'section-1',
    title: 'Introduction to AI & Cloud',
    description: 'Foundational concepts and overview',
    order: 1,
    materials: [
      {
        id: 'mat-1-1',
        title: 'Course Introduction & Overview',
        description: 'Welcome to the course and learning objectives',
        type: 'pdf',
        sectionId: 'section-1',
        sectionTitle: 'Introduction to AI & Cloud',
        order: 1,
        pdfUrl: '/materials/ai-devops-cloud/01-introduction.pdf',
        isLocked: false,
        estimatedTime: '15 min'
      },
      {
        id: 'mat-1-2',
        title: 'AI Fundamentals',
        description: 'Basic concepts of Artificial Intelligence',
        type: 'pdf',
        sectionId: 'section-1',
        sectionTitle: 'Introduction to AI & Cloud',
        order: 2,
        pdfUrl: '/materials/ai-devops-cloud/02-ai-fundamentals.pdf',
        isLocked: false,
        estimatedTime: '30 min'
      },
      {
        id: 'quiz-1-1',
        title: 'Section 1 Quiz',
        description: 'Test your understanding of AI fundamentals',
        type: 'quiz',
        sectionId: 'section-1',
        sectionTitle: 'Introduction to AI & Cloud',
        order: 3,
        quizId: 'quiz-1-1',
        isLocked: true,
        estimatedTime: '10 min'
      }
    ]
  },
  {
    id: 'section-2',
    title: 'Cloud Technologies',
    description: 'AWS and cloud computing essentials',
    order: 2,
    materials: [
      {
        id: 'mat-2-1',
        title: 'AWS Cloud Fundamentals',
        description: 'Introduction to Amazon Web Services',
        type: 'pdf',
        sectionId: 'section-2',
        sectionTitle: 'Cloud Technologies',
        order: 1,
        pdfUrl: '/materials/ai-devops-cloud/03-aws-fundamentals.pdf',
        isLocked: true,
        estimatedTime: '45 min'
      },
      {
        id: 'mat-2-2',
        title: 'Cloud Architecture Patterns',
        description: 'Best practices for cloud architecture',
        type: 'pdf',
        sectionId: 'section-2',
        sectionTitle: 'Cloud Technologies',
        order: 2,
        pdfUrl: '/materials/ai-devops-cloud/04-cloud-architecture.pdf',
        isLocked: true,
        estimatedTime: '40 min'
      }
    ]
  }
]

export function getCourseMaterials(courseId: string): CourseSection[] {
  switch (courseId) {
    case 'ai-devops-cloud':
      return aiDevOpsCourseMaterials
    default:
      return []
  }
}