import { NextResponse } from 'next/server'
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'
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
    
    // Test 1: List tables
    const listCommand = new ListTablesCommand({})
    const tables = await client.send(listCommand)
    
    // Test 2: Scan users table
    const docClient = DynamoDBDocumentClient.from(client)
    const scanCommand = new ScanCommand({
      TableName: 'users',
      Limit: 1
    })
    const scanResult = await docClient.send(scanCommand)
    
    return NextResponse.json({
      success: true,
      tables: tables.TableNames,
      userCount: scanResult.Count,
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID?.substring(0, 12) + '...',
        region: process.env.NEXT_PUBLIC_AWS_REGION
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID?.substring(0, 12) + '...',
        region: process.env.NEXT_PUBLIC_AWS_REGION
      }
    })
  }
}