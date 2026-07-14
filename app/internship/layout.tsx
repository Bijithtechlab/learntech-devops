import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Internship Program - Real-World AI & Cloud Projects',
  description: 'Exclusive hands-on internship for graduates of our AI-Powered Software Development course. Work on real projects with expert mentorship and career placement support.',
  openGraph: {
    title: 'Internship Program | LearnTechLab',
    description: 'Exclusive hands-on internship with real-world AI & Cloud projects and expert mentorship.',
  },
}

export default function InternshipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
