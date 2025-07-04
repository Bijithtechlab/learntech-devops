import './globals.css'
import { Inter } from 'next/font/google'
import ConditionalHeader from '@/components/ConditionalHeader'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LearnTechLab - AI Powered SW Development, DevOps & Cloud: The Future-Ready Engineer',
  description: 'Master AI-Powered Software Development, DevOps, and Cloud Technologies with comprehensive hands-on training',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <ConditionalHeader />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}