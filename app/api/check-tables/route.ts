import { NextResponse } from 'next/server'
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'
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
    // List all tables
    const listCommand = new ListTablesCommand({})
    const tables = await client.send(listCommand)
    
    // Check users table
    let usersData = null
    try {
      const scanCommand = new ScanCommand({
        TableName: 'users',
        Limit: 5
      })
      const result = await docClient.send(scanCommand)
      usersData = result.Items
    } catch (error: any) {
      usersData = { error: error.message }
    }
    
    return NextResponse.json({
      tables: tables.TableNames,
      usersTable: usersData,
      hasUsersTable: tables.TableNames?.includes('users'),
      hasCourseTable: tables.TableNames?.includes('course-registrations')
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      code: error.code
    })
  }
}