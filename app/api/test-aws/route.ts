import { NextResponse } from 'next/server'
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts'

export async function GET() {
  try {
    const stsClient = new STSClient({
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || ''
      }
    })
    
    const command = new GetCallerIdentityCommand({})
    const result = await stsClient.send(command)
    
    return NextResponse.json({
      success: true,
      account: result.Account,
      userId: result.UserId,
      arn: result.Arn,
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
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID?.substring(0, 12) + '...',
        hasAccessKey: !!process.env.MY_AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.MY_AWS_SECRET_ACCESS_KEY,
        region: process.env.NEXT_PUBLIC_AWS_REGION
      }
    })
  }
}