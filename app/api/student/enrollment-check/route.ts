import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { courseId } = await request.json()
    
    if (!courseId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Course ID required' 
      }, { status: 400 })
    }

    // Use existing enrollment API pattern
    const { email } = await request.json()
    
    if (!email) {
      // If no email provided, check via existing enrollments API
      const enrollmentResponse = await fetch(`${request.nextUrl.origin}/api/student/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'default@student.com' })
      })
      
      const enrollmentData = await enrollmentResponse.json()
      const enrolledCourses = enrollmentData.courses || []
      
      return NextResponse.json({
        success: true,
        isEnrolled: enrolledCourses.includes(courseId)
      })
    }

    // Check specific user enrollment
    const enrollmentResponse = await fetch(`${request.nextUrl.origin}/api/student/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const enrollmentData = await enrollmentResponse.json()
    const enrolledCourses = enrollmentData.courses || []

    return NextResponse.json({
      success: true,
      isEnrolled: enrolledCourses.includes(courseId),
      userEmail: email
    })

  } catch (error) {
    console.error('Enrollment check error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Verification failed' 
    }, { status: 500 })
  }
}