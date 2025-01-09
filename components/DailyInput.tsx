import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from 'lucide-react'

interface Goal {
  id: string
  title: string
  daily_target: number
  unit: string
}

interface DailyInputProps {
  goals: Goal[]
  dailyProgress: { [key: string]: number }
  onInputChange: (goalId: string, value: number) => void
  onSubmit: () => void
}

export default function DailyInput({
  goals,
  dailyProgress,
  onInputChange,
  onSubmit,
}: DailyInputProps) {
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const newValues: { [key: string]: number } = {}
    goals.forEach((goal) => {
      const currentProgress = dailyProgress[goal.id]
      newValues[goal.id] = !isNaN(currentProgress) ? currentProgress : 0
    })
    setInputValues(newValues)
  }, [goals, dailyProgress])

  const handleInputChange = (goalId: string, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 0) return

    setInputValues(prev => ({
      ...prev,
      [goalId]: numValue
    }))
    onInputChange(goalId, numValue)
  }

  const handleStepperClick = (goalId: string, increment: boolean, step: number = 0.5) => {
    const currentValue = inputValues[goalId] || 0
    const newValue = increment 
      ? currentValue + step 
      : Math.max(0, currentValue - step)

    setInputValues(prev => ({
      ...prev,
      [goalId]: newValue
    }))
    onInputChange(goalId, newValue)
  }

  const getPresetButtons = (goal: Goal) => {
    const presets = goal.unit === 'hours'
      ? [0, 0.5, 1, 2, 4]
      : [0, 1, 2, 5, 10]

    return presets.map(value => (
      <Button
        key={`${goal.id}-${value}`}
        variant="outline"
        size="sm"
        onClick={() => handleInputChange(goal.id, value.toString())}
        className={`${
          inputValues[goal.id] === value 
            ? 'bg-navy-blue text-white' 
            : 'text-navy-blue hover:bg-navy-blue hover:text-white'
        }`}
      >
        {value} {goal.unit}
      </Button>
    ))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-navy-blue">Daily Input</h2>
      {goals.map((goal) => {
        if (!goal?.id) return null

        const progress = inputValues[goal.id] ?? 0
        const progressPercentage = goal.daily_target 
          ? (progress / goal.daily_target) * 100 
          : 0

        return (
          <div
            key={`goal-${goal.id}`}
            className="space-y-3 p-4 rounded-lg bg-white shadow-sm border border-slate-200 hover:border-navy-blue/30 transition-colors"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-navy-blue">{goal.title}</h3>
              <p className="text-sm text-slate-500">
                Target: {goal.daily_target} {goal.unit}
              </p>
            </div>

            <div className="space-y-4">
              {/* Input with +/- buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStepperClick(goal.id, false)}
                  className="h-8 w-8 border-slate-200 text-navy-blue hover:bg-navy-blue hover:text-white"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <Input
                  type="number"
                  min={0}
                  step={goal.unit === 'hours' ? 0.5 : 1}
                  value={progress}
                  onChange={(e) => handleInputChange(goal.id, e.target.value)}
                  className="w-24 text-center bg-white border-slate-200 text-navy-blue focus-visible:ring-navy-blue"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStepperClick(goal.id, true)}
                  className="h-8 w-8 border-slate-200 text-navy-blue hover:bg-navy-blue hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <span className="text-sm text-slate-500 ml-2">
                  {goal.unit}
                </span>
              </div>

              {/* Preset value buttons */}
              <div className="flex flex-wrap gap-2">
                {getPresetButtons(goal)}
              </div>

              {/* Progress bar */}
              <div className="flex items-center justify-between text-sm">
                <div className="w-full bg-slate-100 rounded-full h-2 mr-3">
                  <div
                    className="bg-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
                  />
                </div>
                <span className="text-slate-500 whitespace-nowrap">
                  {progress} / {goal.daily_target} {goal.unit}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      <Button
        onClick={onSubmit}
        className="w-full bg-navy-blue hover:bg-deep-blue text-white font-semibold"
        disabled={Object.values(inputValues).every((v) => v === 0)}
      >
        Submit Daily Progress
      </Button>
    </div>
  )
}