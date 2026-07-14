import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import ConditionalHeader from '@/components/ConditionalHeader'
import { UserProvider } from '@/contexts/UserContext'
import JsonLd from '@/components/JsonLd'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.learntechlab.com'),
  title: {
    default: 'LearnTechLab - AI Powered Software Development Training',
    template: '%s | LearnTechLab',
  },
  description: 'Master AI-Powered Software Development, Cloud Technologies, and DevOps through hands-on training with industry experts. Courses in Vibe Coding, AWS, GenAI, and more.',
  keywords: ['AI training', 'software development', 'cloud computing', 'AWS', 'DevOps', 'vibe coding', 'generative AI', 'full-stack development', 'online courses', 'LearnTechLab'],
  authors: [{ name: 'LearnTechLab' }],
  creator: 'LearnTechLab',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.learntechlab.com',
    siteName: 'LearnTechLab',
    title: 'LearnTechLab - AI Powered Software Development Training',
    description: 'Master AI-Powered Software Development, Cloud Technologies, and DevOps through hands-on training with industry experts.',
    images: [{ url: '/images/institutions-og.jpg', width: 1200, height: 630, alt: 'LearnTechLab - AI Training Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnTechLab - AI Powered Software Development Training',
    description: 'Master AI-Powered Software Development, Cloud Technologies, and DevOps through hands-on training with industry experts.',
    images: ['/images/institutions-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LearnTechLab',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LearnTechLab LMS" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <JsonLd />
        <UserProvider>
          <ConditionalHeader />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}