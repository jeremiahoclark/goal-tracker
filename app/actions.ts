'use server'

import { getGoals, addDailyProgress } from './lib/db'

export async function fetchGoals() {
  return await getGoals()
}

export async function submitDailyProgress(goalId: string, progress: number) {
  return await addDailyProgress(goalId, progress)
}

