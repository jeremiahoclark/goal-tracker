import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from 'lucide-react'

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

const InputTypes = {
  SLIDER: 'slider',
  STEPPER: 'stepper',
  NUMBER: 'number'
} as const

export default function DailyInput({
  goals,
  dailyProgress,
  onInputChange,
  onSubmit,
}: DailyInputProps) {
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);
  const [sliderValues, setSliderValues] = useState<{ [key: number]: number[] }>({});

  const getInputType = (index: number) => {
    switch(index) {
      case 0: return InputTypes.SLIDER
      case 1: return InputTypes.STEPPER
      case 2: return InputTypes.NUMBER
      default: return InputTypes.NUMBER
    }
  }

  const handleSliderChange = (goalId: number, values: number[]) => {
    setSliderValues(prev => ({ ...prev, [goalId]: values }));
    onInputChange(goalId, values[0]);
  };

  const handleStepperChange = (goalId: number, increment: boolean, currentValue: number, step: number = 0.5) => {
    const newValue = increment ? currentValue + step : Math.max(0, currentValue - step);
    onInputChange(goalId, newValue);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-navy-blue">Daily Input</h2>
      {goals.map((goal, index) => {
        const progress = dailyProgress[goal.id] || 0
        const progressPercentage = (progress / goal.daily_target) * 100
        const inputType = getInputType(index)

        if (inputType === InputTypes.SLIDER && !sliderValues[goal.id]) {
          setSliderValues(prev => ({ ...prev, [goal.id]: [progress] }));
        }

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
              {inputType === InputTypes.SLIDER && (
                <div className="flex-grow">
                  <Slider
                    min={0}
                    max={Math.max(goal.daily_target * 2, 24)}
                    step={0.25}
                    value={sliderValues[goal.id] || [progress]}
                    onValueChange={(values) => handleSliderChange(goal.id, values)}
                    className={`${hoveredGoal === goal.id ? "shadow-sm" : ""}`}
                  />
                </div>
              )}

              {inputType === InputTypes.STEPPER && (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleStepperChange(goal.id, false, progress)}
                    className="h-8 w-8 border-slate-200 text-navy-blue hover:bg-navy-blue hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium min-w-[4rem] text-center text-navy-blue">
                    {progress} {goal.unit}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleStepperChange(goal.id, true, progress)}
                    className="h-8 w-8 border-slate-200 text-navy-blue hover:bg-navy-blue hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {inputType === InputTypes.NUMBER && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    value={progress}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (value >= 0) {
                        onInputChange(goal.id, value)
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