import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    tableName: process.env.DYNAMODB_TABLE_NAME,
    usersTableName: process.env.USERS_TABLE_NAME,
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID?.substring(0, 12) + '...',
    secretKey: process.env.MY_AWS_SECRET_ACCESS_KEY?.substring(0, 12) + '...',
    hasAccessKey: !!process.env.MY_AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.MY_AWS_SECRET_ACCESS_KEY,
    accessKeyLength: process.env.MY_AWS_ACCESS_KEY_ID?.length,
    secretKeyLength: process.env.MY_AWS_SECRET_ACCESS_KEY?.length,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
}