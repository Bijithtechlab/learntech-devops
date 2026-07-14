import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses - AI, Cloud & Full-Stack Development',
  description: 'Explore our courses in AI-Powered Software Development, AWS Cloud, Vibe Coding, DevOps, PMP, and Full-Stack Development. Live sessions with industry experts.',
  openGraph: {
    title: 'Courses | LearnTechLab',
    description: 'Explore our courses in AI-Powered Software Development, AWS Cloud, Vibe Coding, DevOps, and Full-Stack Development.',
  },
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
