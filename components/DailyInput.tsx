import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Goal {
  id: number
  title: string
  daily_target: number
  unit: string
}

interface DailyInputProps {
  goals: Goal[]
  dailyProgress: { [key: number]: number }
  onInputChange: (goalId: number, value: number) => void
  onSubmit: () => void
}

export default function DailyInput({
  goals,
  dailyProgress,
  onInputChange,
  onSubmit,
}: DailyInputProps) {
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null)

  // Keep slider values in sync with dailyProgress
  // so each slider is truly independent.
  const [sliderValues, setSliderValues] = useState<{ [key: number]: number[] }>({})

  useEffect(() => {
    // Initialize each slider from dailyProgress
    const initialValues: { [key: number]: number[] } = {}
    goals.forEach((g) => {
      initialValues[g.id] = [dailyProgress[g.id] || 0]
    })
    setSliderValues(initialValues)
  }, [goals, dailyProgress])

  // This function picks a "max" for the slider.
  // If it's hours, let them go as high as 24 or 2× the daily_target, whichever is larger.
  const getSliderMax = (goal: Goal) => {
    if (goal.unit === 'hours') {
      return Math.max(goal.daily_target * 2, 24)
    }
    return Math.max(goal.daily_target * 2, goal.daily_target)
  }

  // Step size for hours
  const getStepForUnit = (unit: string) => {
    return unit === 'hours' ? 0.25 : 1
  }

  const handleSliderChange = (goal: Goal, values: number[]) => {
    setSliderValues((prev) => ({ ...prev, [goal.id]: values }))
    // Update daily progress with the new slider value
    onInputChange(goal.id, values[0])
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-navy-blue">Daily Input</h2>
      {goals.map((goal) => {
        const progress = dailyProgress[goal.id] || 0
        const progressPercentage = (progress / goal.daily_target) * 100

        return (
          <div
            key={goal.id}
            className="space-y-3 p-4 rounded-lg bg-white shadow-sm border border-slate-200 hover:border-navy-blue/30 transition-colors"
            onMouseEnter={() => setHoveredGoal(goal.id)}
            onMouseLeave={() => setHoveredGoal(null)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-navy-blue">{goal.title}</h3>
              <p className="text-sm text-slate-500">
                Target: {goal.daily_target} {goal.unit}
              </p>
            </div>

            <div className="space-y-2">
              {goal.unit === 'hours' ? (
                <Slider
                  min={0}
                  max={getSliderMax(goal)}
                  step={getStepForUnit(goal.unit)}
                  value={sliderValues[goal.id] || [0]}
                  onValueChange={(values) => handleSliderChange(goal, values)}
                  className={`${hoveredGoal === goal.id ? "shadow-sm" : ""}`}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step={0.5}
                    value={progress}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      if (val >= 0) {
                        onInputChange(goal.id, val)
                      }
                    }}
                    className="w-24 bg-white border-slate-200 text-navy-blue focus-visible:ring-navy-blue"
                  />
                  <span className="text-sm text-slate-500">
                    {goal.unit}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="w-full bg-slate-100 rounded-full h-2 mr-3">
                  <div
                    className="bg-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
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
        disabled={Object.values(dailyProgress).every((v) => v === 0)}
      >
        Submit Daily Progress
      </Button>
    </div>
  )
}