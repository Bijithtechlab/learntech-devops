import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || ''
  }
})
const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const command = new ScanCommand({
      TableName: 'users',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    })

    const result = await docClient.send(command)
    const user = result.Items?.[0]

    if (!user || user.password !== password) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Login failed',
      error: error.message,
      code: error.code
    }, { status: 500 })
  }
}