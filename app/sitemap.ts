import { MetadataRoute } from 'next'
import { courses } from '@/data/courses'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.learntechlab.com'

  const coursePages = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.id}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/courses/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/trainers/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/for-institutions/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/products/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/products/ai-chatbot/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/products/travelnexai/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/internship/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...coursePages,
  ]
}
