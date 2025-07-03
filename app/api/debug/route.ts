import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    tableName: process.env.DYNAMODB_TABLE_NAME,
    hasAccessKey: !!process.env.MY_AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.MY_AWS_SECRET_ACCESS_KEY,
    nodeEnv: process.env.NODE_ENV
  })
}