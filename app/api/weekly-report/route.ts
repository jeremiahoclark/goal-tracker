import { NextResponse } from 'next/server'
import { sendWeeklyReport } from '@/app/lib/reports'

export async function POST(request: Request) {
  try {
    // Add basic auth or API key validation
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (token !== process.env.REPORT_API_KEY) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      )
    }

    const result = await sendWeeklyReport(email)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Weekly report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' }, 
      { status: 500 }
    )
  }
}

// Optional: Allow GET requests to check API health
export async function GET() {
  return NextResponse.json({ status: 'healthy' })
} 