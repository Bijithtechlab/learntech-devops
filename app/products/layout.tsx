import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Products - Agentic Chatbot & TravelNexAI',
  description: 'Explore our AI products: AI Agentic Chatbot for 24/7 customer support and TravelNexAI multi-agent travel planner. Built with cutting-edge AI technology.',
  openGraph: {
    title: 'AI Products | LearnTechLab',
    description: 'AI Agentic Chatbot for customer support and TravelNexAI multi-agent travel planner.',
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
