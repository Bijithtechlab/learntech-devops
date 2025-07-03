import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!
  }
})
const docClient = DynamoDBDocumentClient.from(client)

export async function POST() {
  try {
    const adminUser = {
      id: randomUUID(),
      email: 'admin@learntechlab.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
    
    const command = new PutCommand({
      TableName: 'users',
      Item: adminUser
    })
    
    await docClient.send(command)
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        email: adminUser.email,
        role: adminUser.role
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    })
  }
}