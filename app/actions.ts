'use server'

import { getGoals, addDailyProgress, getMilestones, addMilestone, updateMilestoneStatus, Milestone } from './lib/db'

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

