import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Training for Institutions | LearnTechLab',
  description: 'Make your students AI-Ready. We deliver hands-on training in AI development, cloud computing, and modern software engineering directly at your institution.',
  openGraph: {
    title: 'AI Training for Institutions | LearnTechLab',
    description: 'Make your students AI-Ready. We deliver hands-on training in AI development, cloud computing, and modern software engineering directly at your institution.',
    images: ['https://www.learntechlab.com/images/institutions.png'],
    type: 'website',
  },
}

export default function ForInstitutionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
