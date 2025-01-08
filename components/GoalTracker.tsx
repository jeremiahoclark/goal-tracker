"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import GoalOverview from './GoalOverview'
import GoalCalendar from './GoalCalendar'
import DailyInput from './DailyInput'
import { fetchGoals, submitDailyProgress } from '@/app/actions'

interface Goal {
  id: number
  title: string
  description: string
  why: string
  daily_target: number
  unit: string
  quarterly_target: number
  progress: number
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [dailyProgress, setDailyProgress] = useState<{[key: number]: number}>({})

  useEffect(() => {
    fetchGoals().then(setGoals)
  }, [])

  const handleDailyInput = (goalId: number, value: number) => {
    setDailyProgress(prev => ({ ...prev, [goalId]: value }))
  }

  const handleSubmitDailyProgress = async () => {
    for (const [goalId, progress] of Object.entries(dailyProgress)) {
      const updatedGoal = await submitDailyProgress(Number(goalId), progress)
      setGoals(prevGoals => prevGoals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal))
    }
    setDailyProgress({})
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <DailyInput 
            goals={goals} 
            dailyProgress={dailyProgress} 
            onInputChange={handleDailyInput} 
            onSubmit={handleSubmitDailyProgress} 
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <GoalOverview goals={goals} />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <GoalCalendar goals={goals} />
        </CardContent>
      </Card>
    </div>
  )
}

