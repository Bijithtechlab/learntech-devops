import { NextRequest, NextResponse } from 'next/server'
import AWS from 'aws-sdk'

AWS.config.update({ region: 'ap-south-1' })
const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ success: false, courses: [] }, { status: 400 })
    }

    // Query course-registrations table for this email
    const result = await dynamodb.scan({
      TableName: 'course-registrations',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise()

    const registrations = result.Items || []
    const enrolledCourses: string[] = []

    // Check each registration for completed payment
    registrations.forEach((registration: any) => {
      // Check both PaymentStatus and paymentStatus (case variations)
      const paymentStatus = registration.PaymentStatus || registration.paymentStatus
      
      if (paymentStatus === 'completed' && registration.courseId) {
        enrolledCourses.push(registration.courseId)
      }
    })

    console.log(`Enrollments for ${email}:`, enrolledCourses)
    
    return NextResponse.json({ success: true, courses: enrolledCourses })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { success: false, courses: [] },
      { status: 500 }
    )
  }
}