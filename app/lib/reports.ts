import { goalsTable, progressTable } from './airtable'

interface WeeklyProgress {
  goalId: string
  goalTitle: string
  weeklyTotal: number
  dailyTarget: number
  unit: string
  daysLogged: number
  milestones: {
    completed: number
    inProgress: number
    notStarted: number
  }
}

async function getWeeklyProgress(): Promise<WeeklyProgress[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)
  
  const goals = await goalsTable.select().all()
  const progress = await progressTable.select({
    filterByFormula: `IS_AFTER({Date}, '${startDate.toISOString().split('T')[0]}')`
  }).all()

  const progressByGoal = progress.reduce((acc, record) => {
    const goalId = (record.get('Goal') as string[])[0]
    const value = record.get('Progress') as number
    
    if (!acc[goalId]) {
      acc[goalId] = {
        total: 0,
        days: new Set()
      }
    }
    
    acc[goalId].total += value
    acc[goalId].days.add(record.get('Date') as string)
    return acc
  }, {} as Record<string, { total: number; days: Set<string> }>)

  return goals.map(goal => ({
    goalId: goal.id,
    goalTitle: goal.get('Title') as string,
    weeklyTotal: progressByGoal[goal.id]?.total || 0,
    dailyTarget: goal.get('Daily Target') as number,
    unit: goal.get('Unit') as string,
    daysLogged: progressByGoal[goal.id]?.days.size || 0,
    milestones: {
      completed: 0, // We'll add milestone tracking in a separate update
      inProgress: 0,
      notStarted: 0
    }
  }))
}

function generateReportHtml(progress: WeeklyProgress[]): string {
  const date = new Date()
  const reportHtml = `
    <h1>Weekly Progress Report</h1>
    <p>Week of ${date.toLocaleDateString()}</p>
    
    ${progress.map(goal => `
      <div style="margin-bottom: 20px;">
        <h2>${goal.goalTitle}</h2>
        <ul>
          <li>Weekly Progress: ${goal.weeklyTotal} ${goal.unit}</li>
          <li>Daily Target: ${goal.dailyTarget} ${goal.unit}</li>
          <li>Days Logged: ${goal.daysLogged}/7</li>
          <li>Weekly Target Progress: ${Math.round((goal.weeklyTotal / (goal.dailyTarget * 7)) * 100)}%</li>
        </ul>
      </div>
    `).join('')}
  `
  return reportHtml
}

export async function sendWeeklyReport(recipientEmail: string) {
  const progress = await getWeeklyProgress()
  const reportHtml = generateReportHtml(progress)
  
  const response = await fetch(`${process.env.NAVI_URL}/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: `Weekly Goal Progress Report - ${new Date().toLocaleDateString()}`,
      body: reportHtml,
      recipient_email: recipientEmail
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to send report')
  }

  return response.json()
} 