import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    console.log('Checking payment status for:', email)

    const response = await fetch('https://qgeusz2rj7.execute-api.ap-south-1.amazonaws.com/prod/check-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const data = await response.json()
    console.log('Registration data:', data)

    if (!data.success || !data.registration) {
      console.log('User not registered')
      return NextResponse.json({ error: 'NOT_REGISTERED' }, { status: 400 })
    }

    const paymentStatus = data.registration.PaymentStatus
    console.log('Payment status:', paymentStatus)
    
    if (paymentStatus !== 'completed') {
      if (paymentStatus === 'pending' || paymentStatus === 'in-progress') {
        return NextResponse.json({ error: 'PAYMENT_PENDING' }, { status: 400 })
      } else {
        return NextResponse.json({ error: 'PAYMENT_REQUIRED' }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, paymentStatus: 'completed' })
  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json({ error: 'PAYMENT_REQUIRED' }, { status: 500 })
  }
}