import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!
  }
})
const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      )
    }

    const command = new QueryCommand({
      TableName: 'users',
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    })

    const result = await docClient.send(command)
    const user = result.Items?.[0]

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Set session cookie
    response.cookies.set('session', JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode
    })
    return NextResponse.json(
      { 
        success: false, 
        message: 'Login failed',
        error: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}