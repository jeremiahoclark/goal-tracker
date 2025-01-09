import { goalsTable, progressTable, milestonesTable } from './airtable';

export interface Goal {
  id: string;
  title: string;
  description: string;
  why: string;
  daily_target: number;
  unit: string;
  quarterly_target: number;
  progress: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  goalId: string;
  targetDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  targetValue: number;
}

export async function getGoals(): Promise<Goal[]> {
  const records = await goalsTable.select().all();
  return records.map(record => ({
    id: record.id,
    title: record.get('Title') as string,
    description: record.get('Description') as string,
    why: record.get('Why') as string,
    daily_target: record.get('Daily Target') as number,
    unit: record.get('Unit') as string,
    quarterly_target: record.get('Quarterly Target') as number,
    progress: (record.get('Progress') as number) || 0,
  }));
}

export async function getMilestones(): Promise<Milestone[]> {
  const records = await milestonesTable.select().all();
  return records.map(record => ({
    id: record.id,
    title: record.get('Title') as string,
    description: record.get('Description') as string,
    goalId: (record.get('Goal') as string[])[0],
    targetDate: record.get('Target Date') as string,
    status: record.get('Status') as 'Not Started' | 'In Progress' | 'Completed',
    targetValue: record.get('Target Value') as number,
  }));
}

export async function addMilestone(milestone: Omit<Milestone, 'id'>): Promise<Milestone> {
  const record = await milestonesTable.create({
    'Title': milestone.title,
    'Description': milestone.description,
    'Goal': [milestone.goalId],
    'Target Date': milestone.targetDate,
    'Status': milestone.status,
    'Target Value': milestone.targetValue,
  });

  return {
    id: record.id,
    title: record.get('Title') as string,
    description: record.get('Description') as string,
    goalId: (record.get('Goal') as string[])[0],
    targetDate: record.get('Target Date') as string,
    status: record.get('Status') as 'Not Started' | 'In Progress' | 'Completed',
    targetValue: record.get('Target Value') as number,
  };
}

export async function updateMilestoneStatus(id: string, status: 'Not Started' | 'In Progress' | 'Completed'): Promise<Milestone> {
  const record = await milestonesTable.update(id, {
    'Status': status,
  });

  return {
    id: record.id,
    title: record.get('Title') as string,
    description: record.get('Description') as string,
    goalId: (record.get('Goal') as string[])[0],
    targetDate: record.get('Target Date') as string,
    status: record.get('Status') as 'Not Started' | 'In Progress' | 'Completed',
    targetValue: record.get('Target Value') as number,
  };
}

export async function addDailyProgress(goalId: string, progress: number) {
  // Add progress entry
  await progressTable.create([
    {
      fields: {
        'Goal': [goalId],
        'Progress': progress,
        'Date': new Date().toISOString().split('T')[0],
      }
    }
  ]);

  // Update total progress in the goal
  const goal = await goalsTable.find(goalId);
  const currentProgress = (goal.get('Progress') as number) || 0;
  const updatedGoal = await goalsTable.update(goalId, {
    'Progress': currentProgress + progress,
  });

  return {
    id: updatedGoal.id,
    title: updatedGoal.get('Title') as string,
    description: updatedGoal.get('Description') as string,
    why: updatedGoal.get('Why') as string,
    daily_target: updatedGoal.get('Daily Target') as number,
    unit: updatedGoal.get('Unit') as string,
    quarterly_target: updatedGoal.get('Quarterly Target') as number,
    progress: (updatedGoal.get('Progress') as number) || 0,
  };
}

