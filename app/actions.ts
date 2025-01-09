'use server'

import { getGoals, addDailyProgress, getMilestones, addMilestone, updateMilestoneStatus, Milestone } from './lib/db'
import { sendWeeklyReport } from './lib/reports'

export async function fetchGoals() {
  return await getGoals()
}

export async function submitDailyProgress(goalId: string, progress: number) {
  return await addDailyProgress(goalId, progress)
}

export async function fetchMilestones() {
  return await getMilestones()
}

export async function createMilestone(milestone: Omit<Milestone, 'id'>) {
  return await addMilestone(milestone)
}

export async function updateMilestoneState(id: string, status: 'Not Started' | 'In Progress' | 'Completed') {
  return await updateMilestoneStatus(id, status)
}

export async function generateAndSendReport(email: string) {
  try {
    return await sendWeeklyReport(email)
  } catch (error) {
    console.error('Failed to send report:', error)
    throw error
  }
}

