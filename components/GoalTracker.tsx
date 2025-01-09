"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import GoalOverview from './GoalOverview'
import GoalCalendar from './GoalCalendar'
import DailyInput from './DailyInput'
import MilestonesSection from './MilestonesSection'
import WeeklyReportButton from './WeeklyReportButton'
import { fetchGoals, submitDailyProgress } from '@/app/actions'
import { Toaster } from 'sonner'

interface Goal {
  id: string
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
  const [dailyProgress, setDailyProgress] = useState<{[key: string]: number}>({})

  useEffect(() => {
    fetchGoals().then(setGoals)
  }, [])

  const handleDailyInput = (goalId: string, value: number) => {
    setDailyProgress(prev => ({ ...prev, [goalId]: value }))
  }

  const handleSubmitDailyProgress = async () => {
    for (const [goalId, progress] of Object.entries(dailyProgress)) {
      const updatedGoal = await submitDailyProgress(goalId, progress)
      setGoals(prevGoals => prevGoals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal))
    }
    setDailyProgress({})
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex justify-end">
          <WeeklyReportButton />
        </div>
        <Card>
          <CardContent className="pt-6">
            <GoalOverview goals={goals} />
          </CardContent>
        </Card>
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
            <MilestonesSection goals={goals} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <GoalCalendar goals={goals} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

