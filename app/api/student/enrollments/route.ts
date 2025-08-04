import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // For now, return hardcoded enrollments based on email
    // In production, this would query a proper enrollments table
    const enrollments: Record<string, string[]> = {
      'bijichnr@gmail.com': ['smart-coding-revolution', 'ai-devops-cloud'],
      // Add other student enrollments as needed
    }
    
    const courses = enrollments[email] || []
    
    return NextResponse.json({ success: true, courses })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { success: false, courses: [] },
      { status: 500 }
    )
  }
}