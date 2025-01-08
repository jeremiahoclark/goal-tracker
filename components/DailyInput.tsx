import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface Goal {
  id: number
  title: string
  daily_target: number
  unit: string
}

interface DailyInputProps {
  goals: Goal[]
  dailyProgress: {[key: number]: number}
  onInputChange: (goalId: number, value: number) => void
  onSubmit: () => void
}

export default function DailyInput({ goals, dailyProgress, onInputChange, onSubmit }: DailyInputProps) {
  const [hoveredGoal, setHoveredGoal] = useState<number | null>(null);

  const getPresetValues = (target: number): number[] => {
    if (target >= 4) return [0, target/4, target/2, (3*target)/4, target];
    if (target >= 2) return [0, target/2, target];
    return [0, target];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Daily Input</h2>
      {goals.map(goal => {
        const progress = dailyProgress[goal.id] || 0;
        const progressPercentage = (progress / goal.daily_target) * 100;
        const presetValues = getPresetValues(goal.daily_target);
        
        return (
          <div 
            key={goal.id} 
            className="space-y-3 p-4 rounded-lg bg-background/95 shadow-sm border"
            onMouseEnter={() => setHoveredGoal(goal.id)}
            onMouseLeave={() => setHoveredGoal(null)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{goal.title}</h3>
              <p className="text-sm text-muted-foreground">
                Target: {goal.daily_target} {goal.unit}
              </p>
            </div>
            
            <div className="space-y-2">
              {goal.unit === 'hours' ? (
                <>
                  <div className="flex-grow">
                    <Slider
                      min={0}
                      max={goal.daily_target}
                      step={0.5}
                      value={[progress]}
                      onValueChange={([value]) => onInputChange(goal.id, value)}
                      className={`${hoveredGoal === goal.id ? 'shadow-sm' : ''}`}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {presetValues.map((value) => (
                      <Button 
                        key={value}
                        variant="outline" 
                        size="sm"
                        onClick={() => onInputChange(goal.id, value)}
                        className={`${progress === value ? 'bg-primary/10' : ''}`}
                      >
                        {value} {goal.unit}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min={0}
                    max={goal.daily_target}
                    value={progress}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= goal.daily_target) {
                        onInputChange(goal.id, value);
                      }
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">{goal.unit}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <Progress value={progressPercentage} className="w-full" />
                <span className="ml-2 text-muted-foreground">
                  {progress} / {goal.daily_target} {goal.unit}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      <Button 
        onClick={onSubmit} 
        className="w-full"
        disabled={Object.values(dailyProgress).every(v => v === 0)}
      >
        Submit Daily Progress
      </Button>
    </div>
  )
}

