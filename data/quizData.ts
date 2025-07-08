export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  sectionId: string
  sectionTitle: string
  questions: QuizQuestion[]
  passingScore: number
  timeLimit?: number // in minutes
}

export interface QuizAttempt {
  id: string
  quizId: string
  email: string
  answers: number[]
  score: number
  passed: boolean
  completedAt: string
  timeSpent: number // in seconds
}

// Sample quiz data
export const quizzes: Quiz[] = [
  {
    id: 'quiz-1-1',
    title: 'Section 1 Quiz',
    description: 'Test your understanding of AI fundamentals',
    sectionId: 'section-1',
    sectionTitle: 'Introduction to AI & Cloud',
    passingScore: 70,
    timeLimit: 10,
    questions: [
      {
        id: 'q1-1',
        question: 'What does AI stand for?',
        options: [
          'Artificial Intelligence',
          'Automated Integration',
          'Advanced Information',
          'Application Interface'
        ],
        correctAnswer: 0,
        explanation: 'AI stands for Artificial Intelligence, which refers to the simulation of human intelligence in machines.'
      },
      {
        id: 'q1-2',
        question: 'Which of the following is a key characteristic of machine learning?',
        options: [
          'Manual programming of all decisions',
          'Learning from data without explicit programming',
          'Only works with structured data',
          'Requires constant human supervision'
        ],
        correctAnswer: 1,
        explanation: 'Machine learning systems can learn and improve from data without being explicitly programmed for every scenario.'
      },
      {
        id: 'q1-3',
        question: 'What is the primary benefit of cloud computing?',
        options: [
          'Higher hardware costs',
          'Limited scalability',
          'On-demand resource access',
          'Reduced security'
        ],
        correctAnswer: 2,
        explanation: 'Cloud computing provides on-demand access to computing resources, allowing for flexible scaling and cost optimization.'
      },
      {
        id: 'q1-4',
        question: 'Which AWS service is primarily used for object storage?',
        options: [
          'EC2',
          'RDS',
          'S3',
          'Lambda'
        ],
        correctAnswer: 2,
        explanation: 'Amazon S3 (Simple Storage Service) is designed for object storage with high durability and availability.'
      },
      {
        id: 'q1-5',
        question: 'What is the main advantage of DevOps practices?',
        options: [
          'Slower deployment cycles',
          'Increased collaboration between development and operations',
          'More manual processes',
          'Reduced automation'
        ],
        correctAnswer: 1,
        explanation: 'DevOps emphasizes collaboration between development and operations teams to improve deployment speed and reliability.'
      }
    ]
  }
]

export function getQuizById(quizId: string): Quiz | null {
  return quizzes.find(quiz => quiz.id === quizId) || null
}

// Fetch quiz from API
export async function fetchQuizById(quizId: string): Promise<Quiz | null> {
  try {
    const response = await fetch(`/api/admin/quiz-questions?quizId=${quizId}`)
    const data = await response.json()
    
    if (data.success && data.questions.length > 0) {
      // Convert API data to Quiz format
      const quiz: Quiz = {
        id: quizId,
        title: `Quiz ${quizId}`,
        description: 'Dynamic quiz from database',
        sectionId: 'section-1',
        sectionTitle: 'Course Section',
        questions: data.questions,
        passingScore: 70,
        timeLimit: 10
      }
      return quiz
    }
    
    // Fallback to static data
    return getQuizById(quizId)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return getQuizById(quizId)
  }
}