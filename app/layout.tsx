import './globals.css'
import { Inter } from 'next/font/google'
import ConditionalHeader from '@/components/ConditionalHeader'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LearnTechLab LMS - Learning Management System for AI-Powered Software Development',
  description: 'Comprehensive Learning Management System for AI-Powered Software Development, DevOps, and Cloud Technologies',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LearnTechLab LMS'
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
        <meta name="apple-mobile-web-app-title" content="LearnTechLab LMS" />
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