import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/student/', '/login/'],
      },
    ],
    sitemap: 'https://www.learntechlab.com/sitemap.xml',
  }
}
