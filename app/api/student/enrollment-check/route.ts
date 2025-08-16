import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils'

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json()
    
    if (!courseId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Course ID required' 
      }, { status: 400 })
    }

    // Get current user from Amplify session
    const user = await runWithAmplifyServerContext({
      nextServerContext: { request },
      operation: (contextSpec) => getCurrentUser(contextSpec)
    })

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authenticated' 
      }, { status: 401 })
    }

    // Get user's enrolled courses from attributes
    const enrolledCourses = user.signInDetails?.loginId ? 
      await getUserEnrolledCourses(user.signInDetails.loginId) : []

    const isEnrolled = enrolledCourses.includes(courseId)

    return NextResponse.json({
      success: true,
      isEnrolled,
      userEmail: user.signInDetails?.loginId
    })

  } catch (error) {
    console.error('Enrollment check error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Verification failed' 
    }, { status: 500 })
  }
}

async function getUserEnrolledCourses(email: string): Promise<string[]> {
  try {
    // Fetch user's enrolled courses from your user management system
    const response = await fetch(`https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/student-profile?email=${email}`)
    const data = await response.json()
    
    if (data.success && data.student) {
      return data.student.enrolledCourses || []
    }
    
    return []
  } catch (error) {
    console.error('Error fetching enrolled courses:', error)
    return []
  }
}