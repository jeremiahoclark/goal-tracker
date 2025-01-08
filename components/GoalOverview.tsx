import { Progress } from "@/components/ui/progress"

interface Goal {
  id: number
  title: string
  quarterly_target: number
  progress: number
}

export default function GoalOverview({ goals }: { goals: Goal[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Progress Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map(goal => (
          <div key={goal.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">{goal.title}</h3>
            <Progress value={(goal.progress / goal.quarterly_target) * 100} className="mb-2" />
            <p className="text-sm text-right">
              {Math.round((goal.progress / goal.quarterly_target) * 100)}% completed
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

