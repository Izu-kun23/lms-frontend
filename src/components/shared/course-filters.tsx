"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type CourseStatus = "all" | "in-progress" | "completed" | "not-started"

interface CourseFiltersProps {
  status: CourseStatus
  onStatusChange: (status: CourseStatus) => void
  className?: string
}

export function CourseFilters({
  status,
  onStatusChange,
  className,
}: CourseFiltersProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Courses</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="not-started">Not Started</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

