'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface StudentUser {
  email: string
  firstName: string
  lastName: string
  userId: string
  enrolledCourses: string[]
}

interface StudentAuthContextType {
  user: StudentUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined)

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const { Amplify } = await import('aws-amplify')
      const { getCurrentUser, fetchUserAttributes, signOut } = await import('aws-amplify/auth')
      
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: 'ap-south-1_5bmOBtUaw',
            userPoolClientId: '3t3qb2mff70p5m2rob38pbuss8',
          },
        },
      })

      let currentUser, attributes
      try {
        currentUser = await getCurrentUser()
        attributes = await fetchUserAttributes()
      } catch (authError: any) {
        if (authError.name === 'UserUnAuthenticatedException') {
          setUser(null)
          return
        }
        throw authError
      }
      
      console.log('Current user:', currentUser)
      console.log('All Cognito attributes:', attributes)
      console.log('Email from attributes:', attributes.email)
      console.log('Given name:', attributes.given_name)
      console.log('Family name:', attributes.family_name)
      
      // Fetch enrolled courses
      const enrolledCourses = await fetchEnrolledCourses(attributes.email || '')
      
      const userData = {
        email: attributes.email || '',
        firstName: attributes.given_name || 'Student',
        lastName: attributes.family_name || '',
        userId: currentUser.userId,
        enrolledCourses
      }
      
      console.log('Setting user data:', userData)
      setUser(userData)
    } catch (error: any) {
      console.log('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrolledCourses = async (email: string): Promise<string[]> => {
    try {
      const response = await fetch('/api/student/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      return data.courses || ['ai-devops-cloud']
    } catch (error) {
      return ['ai-devops-cloud']
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { signIn: cognitoSignIn } = await import('aws-amplify/auth')
      await cognitoSignIn({ username: email, password })
      await checkAuthState()
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      const { signOut: cognitoSignOut } = await import('aws-amplify/auth')
      await cognitoSignOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <StudentAuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      isAuthenticated: !!user
    }}>
      {children}
    </StudentAuthContext.Provider>
  )
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext)
  if (context === undefined) {
    throw new Error('useStudentAuth must be used within a StudentAuthProvider')
  }
  return context
}