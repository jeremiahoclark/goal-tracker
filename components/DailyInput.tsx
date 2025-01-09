import { useState } from 'react'
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
  // dailyProgress is an object mapping goalId -> current number/progress
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
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);

  // If you want to allow going beyond daily_target, you can remove the “max” constraint
  // or set a higher max (e.g. 24 hours). This helper chooses a max that is at least daily_target
  // or something bigger (like 24).
  const getSliderMax = (goal: Goal) => {
    if (goal.unit === "hours") {
      return Math.max(goal.daily_target, 24) // you can pick any “large” number
    }
    // if it’s a different unit, you could handle separately.
    return goal.daily_target
  }

  // Example for preset values. This is entirely up to you.
  // If you want to allow beyond daily_target, you can add more points.
  const getPresetValues = (goal: Goal): number[] => {
    const { daily_target: t, unit } = goal
    // if your daily_target is large or small, adapt these sets as you see fit
    if (unit === 'hours') {
      // Let’s say we always give 0, half, full target, plus a couple beyond
      // for demonstration: if target=2, we’d have [0, 1, 2, 3, 4]
      return [0, t / 2, t, t + 1, t + 2].map((val) => +val.toFixed(1))
    }
    // for other units, maybe 0 -> target
    return [0, t]
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Daily Input</h2>
      {goals.map((goal) => {
        const progress = dailyProgress[goal.id] || 0
        const progressPercentage = (progress / goal.daily_target) * 100
        const presetValues = getPresetValues(goal)

        return (
          <div
            key={goal.id}
            className="space-y-3 p-4 rounded-lg bg-background shadow-sm border border-secondary/20 hover:border-secondary/40 transition-colors"
            onMouseEnter={() => setHoveredGoal(goal.id)}
            onMouseLeave={() => setHoveredGoal(null)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-primary">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">
                Target: {goal.daily_target} {goal.unit}
              </p>
            </div>

            <div className="space-y-2">
              {goal.unit === "hours" ? (
                <>
                  {/* Slider can go beyond daily_target by using getSliderMax() */}
                  <div className="flex-grow">
                    <Slider
                      min={0}
                      max={getSliderMax(goal)}
                      step={0.25} // can set whatever step you prefer
                      value={[progress]}
                      onValueChange={([value]) => onInputChange(goal.id, value)}
                      className={`${
                        hoveredGoal === goal.id ? "shadow-sm" : ""
                      }`}
                    />
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {presetValues.map((value) => (
                      <Button
                        key={value}
                        variant={progress === value ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => onInputChange(goal.id, value)}
                      >
                        {value} {goal.unit}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                // For other units, remove the “max” attribute to allow going beyond the target
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min={0}
                    // remove max entirely or set a custom “big” max if you like
                    value={progress}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      // If you truly don’t want to clamp, just pass the value
                      onInputChange(goal.id, value)
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    {goal.unit}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="w-full bg-primary/10 rounded-full h-2 mr-3">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <span className="text-muted-foreground whitespace-nowrap">
                  {progress} / {goal.daily_target} {goal.unit}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      <Button
        onClick={onSubmit}
        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        disabled={Object.values(dailyProgress).every((v) => v === 0)}
      >
        Submit Daily Progress
      </Button>
    </div>
  )
}