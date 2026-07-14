import { Metadata } from 'next'
import { getCourseById } from '@/data/courses'

interface Props {
  params: { courseId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourseById(params.courseId)
  if (!course) return { title: 'Course Not Found' }

  const description = course.description.replace(/<[^>]*>/g, '').slice(0, 160)

  return {
    title: course.title,
    description,
    openGraph: {
      title: `${course.title} | LearnTechLab`,
      description,
      type: 'website',
    },
  }
}

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
