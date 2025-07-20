import './globals.css'
import { Inter } from 'next/font/google'
import ConditionalHeader from '@/components/ConditionalHeader'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LearnTechLab - AI Powered Software Development - Cloud, Generative AI, & Vibe Coding: The Future-Ready Engineer',
  description: 'Master AI-Powered Software Development, DevOps, and Cloud Technologies with comprehensive hands-on training',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'learntechlab'
  }
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
        <meta name="apple-mobile-web-app-title" content="learntechlab" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <UserProvider>
          <ConditionalHeader />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}