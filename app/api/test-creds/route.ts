import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID?.substring(0, 8) + '...',
    secretKey: process.env.MY_AWS_SECRET_ACCESS_KEY?.substring(0, 8) + '...',
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    accessKeyExists: !!process.env.MY_AWS_ACCESS_KEY_ID,
    secretKeyExists: !!process.env.MY_AWS_SECRET_ACCESS_KEY,
    accessKeyType: typeof process.env.MY_AWS_ACCESS_KEY_ID,
    secretKeyType: typeof process.env.MY_AWS_SECRET_ACCESS_KEY
  })
}