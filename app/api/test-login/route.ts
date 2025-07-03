import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

export async function GET() {
  try {
    const client = new DynamoDBClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || ''
      }
    })
    const docClient = DynamoDBDocumentClient.from(client)
    
    // Test exact same logic as auth API
    const command = new ScanCommand({
      TableName: process.env.USERS_TABLE_NAME || 'users',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': 'admin@learntechlab.com'
      }
    })

    const result = await docClient.send(command)
    const user = result.Items?.[0]
    
    return NextResponse.json({
      success: true,
      userFound: !!user,
      userEmail: user?.email,
      userRole: user?.role,
      hasPassword: !!user?.password,
      passwordMatch: user?.password === 'admin123',
      totalUsers: result.Count,
      tableName: process.env.USERS_TABLE_NAME || 'users'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      tableName: process.env.USERS_TABLE_NAME || 'users'
    })
  }
}