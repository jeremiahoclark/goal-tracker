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

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const isGoalCompleted = (day: number) => {
    // This is a placeholder logic. You should implement actual tracking logic here.
    return goals.every(goal => (goal.progress / goal.daily_target) >= day)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Goal Calendar</h2>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <Button variant="outline" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
        {weekDays.map((day, index) => (
          <div key={`weekday-${index}`} className="font-semibold text-xs sm:text-sm">{day[0]}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const isCompleted = isGoalCompleted(day)
          return (
            <div 
              key={`day-${day}`}
              className={`aspect-square flex items-center justify-center rounded-full text-xs sm:text-sm
                ${isCompleted ? 'bg-green-500 text-white' : 'border'}`}
            >
              {isCompleted ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

