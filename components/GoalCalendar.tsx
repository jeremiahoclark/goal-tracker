import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Goal {
  id: number
  daily_target: number
  progress: number
}

export default function GoalCalendar({ goals }: { goals: Goal[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const getDayCompletion = () => {
    const completedCount = goals.filter(
      (goal) => goal.progress >= goal.daily_target
    ).length

    if (completedCount === goals.length) {
      return "completeAll"
    } else if (completedCount > 0) {
      return "partial"
    }
    return "none"
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="p-4 rounded-lg border border-secondary/20 bg-background/95">
      <h2 className="text-xl font-semibold mb-4 text-primary">Goal Calendar</h2>
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={prevMonth}
          className="border-secondary/20 hover:bg-secondary/10 hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-primary">
          {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <Button 
          variant="outline" 
          onClick={nextMonth}
          className="border-secondary/20 hover:bg-secondary/10 hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {weekDays.map((day, index) => (
          <div 
            key={`weekday-${index}`} 
            className="font-medium text-xs sm:text-sm text-primary/80 mb-2"
          >
            {day[0]}
          </div>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const dayStatus = getDayCompletion()
          const today = new Date()
          const isToday = 
            today.getDate() === day && 
            today.getMonth() === currentMonth.getMonth() && 
            today.getFullYear() === currentMonth.getFullYear()

          const baseClasses = "aspect-square flex items-center justify-center rounded-full text-xs sm:text-sm transition-all duration-200"
          let statusClasses = ""

          if (dayStatus === "completeAll") {
            statusClasses = "bg-primary text-primary-foreground shadow-sm"
          } else if (dayStatus === "partial") {
            statusClasses = "bg-secondary text-secondary-foreground shadow-sm"
          } else {
            statusClasses = "border border-secondary/20 hover:border-secondary/40"
            if (isToday) {
              statusClasses += " border-primary/40"
            }
          }

          return (
            <div
              key={`day-${day}`}
              className={`${baseClasses} ${statusClasses}`}
            >
              {dayStatus === "completeAll" ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                day
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

