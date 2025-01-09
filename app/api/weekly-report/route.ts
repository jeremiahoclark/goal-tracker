import { NextResponse } from 'next/server'
import { sendWeeklyReport } from '@/app/lib/reports'

export async function POST(request: Request) {
  console.log(`[Weekly Report API] Received request at ${new Date().toISOString()}`)

  try {
    // Add basic auth or API key validation
    const authHeader = request.headers.get('authorization')
    console.log(`[Weekly Report API] Authorization Header: ${authHeader}`)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[Weekly Report API] Missing or invalid authorization header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    console.log(`[Weekly Report API] Received token: ${token}`)
    console.log(`[Weekly Report API] Expected token: ${process.env.REPORT_API_KEY}`)

    if (token !== process.env.REPORT_API_KEY) {
      console.error('[Weekly Report API] Invalid API key')
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Parse request body
    const requestBody = await request.json()
    console.log(`[Weekly Report API] Request Body: ${JSON.stringify(requestBody, null, 2)}`)

    const { email } = requestBody
    
    if (!email) {
      console.error('[Weekly Report API] Missing email parameter')
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      )
    }

    console.log(`[Weekly Report API] Sending report to: ${email}`)
    const result = await sendWeeklyReport(email)
    
    console.log(`[Weekly Report API] Report sent successfully: ${JSON.stringify(result)}`)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`[Weekly Report API] Error:`, error)
    return NextResponse.json(
      { 
        error: 'Failed to generate or send report', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Optional: Allow GET requests to check API health
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  })
} 