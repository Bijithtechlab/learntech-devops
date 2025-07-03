import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!
  }
})
const docClient = DynamoDBDocumentClient.from(client)

export async function GET() {
  try {
    // Test DynamoDB connection
    const command = new ScanCommand({
      TableName: 'users',
      Limit: 1
    })
    
    const result = await docClient.send(command)
    
    return NextResponse.json({
      success: true,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      tableAccess: 'OK',
      userCount: result.Count,
      sampleUser: result.Items?.[0] ? {
        email: result.Items[0].email,
        role: result.Items[0].role
      } : null
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      statusCode: error.$metadata?.httpStatusCode
    })
  }
}