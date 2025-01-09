"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMilestone } from '@/app/actions'
import type { Milestone } from '@/app/lib/db'

interface AddMilestoneDialogProps {
  goalId: string
  goalTitle: string
  onMilestoneAdded: (milestone: Milestone) => void
}

export default function AddMilestoneDialog({ goalId, goalTitle, onMilestoneAdded }: AddMilestoneDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [targetValue, setTargetValue] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const milestone = await createMilestone({
      title,
      description,
      goalId,
      targetDate,
      status: 'Not Started',
      targetValue: parseFloat(targetValue),
    })

    onMilestoneAdded(milestone)
    setOpen(false)
    setTitle('')
    setDescription('')
    setTargetDate('')
    setTargetValue('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Milestone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Milestone for {goalTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Milestone title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe your milestone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value</Label>
            <Input
              id="targetValue"
              type="number"
              step="0.1"
              value={targetValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetValue(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Milestone
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 