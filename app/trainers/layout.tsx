import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Trainers - Industry Experts with 50+ Years Experience',
  description: 'Meet our expert trainers: Vinod Kumar (39+ years, 15,000+ students) and Bijith Meethale Kondayattu (PMP®, CPMAI®, 14+ years international AI & Cloud experience).',
  openGraph: {
    title: 'Our Trainers | LearnTechLab',
    description: 'Industry veterans with 50+ years combined experience in AI, Cloud, and Software Development training.',
  },
}

export default function TrainersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
