"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { fetchMilestones, updateMilestoneState } from '@/app/actions'
import type { Milestone } from '@/app/lib/db'

interface MilestonesSectionProps {
  goals: Array<{ id: string; title: string; }>
}

export default function MilestonesSection({ goals }: MilestonesSectionProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    fetchMilestones().then(setMilestones)
  }, [])

  const handleStatusChange = async (id: string, status: 'Not Started' | 'In Progress' | 'Completed') => {
    const updatedMilestone = await updateMilestoneState(id, status)
    setMilestones(prev => prev.map(m => m.id === id ? updatedMilestone : m))
  }

  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const goalId = milestone.goalId
    if (!acc[goalId]) {
      acc[goalId] = []
    }
    acc[goalId].push(milestone)
    return acc
  }, {} as Record<string, Milestone[]>)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-navy-blue">Milestones</h2>
      {goals.map(goal => {
        const goalMilestones = groupedMilestones[goal.id] || []
        if (goalMilestones.length === 0) return null

        return (
          <div key={goal.id} className="space-y-4">
            <h3 className="font-medium text-lg text-navy-blue">{goal.title}</h3>
            {goalMilestones
              .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
              .map(milestone => (
                <div
                  key={milestone.id}
                  className="p-4 rounded-lg bg-white shadow-sm border border-slate-200 hover:border-navy-blue/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-navy-blue">{milestone.title}</h4>
                      <p className="text-sm text-slate-500">{milestone.description}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      Target: {milestone.targetValue}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Button
                      variant={milestone.status === 'Not Started' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(milestone.id, 'Not Started')}
                    >
                      Not Started
                    </Button>
                    <Button
                      variant={milestone.status === 'In Progress' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(milestone.id, 'In Progress')}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={milestone.status === 'Completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(milestone.id, 'Completed')}
                    >
                      Completed
                    </Button>
                  </div>

                  <div className="text-sm text-slate-500">
                    Due: {new Date(milestone.targetDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        )
      })}
    </div>
  )
} 