"use client"

import { CheckCircle2, Clock, BookOpen, FileText, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

interface TimelineItem {
  id: string
  type: "LECTURE_COMPLETED" | "ASSIGNMENT_SUBMITTED" | "QUIZ_COMPLETED" | "COURSE_STARTED"
  title: string
  description: string
  timestamp: string
  courseTitle?: string
}

interface ProgressTimelineProps {
  items: TimelineItem[]
  className?: string
}

const typeIcons = {
  LECTURE_COMPLETED: BookOpen,
  ASSIGNMENT_SUBMITTED: FileText,
  QUIZ_COMPLETED: CheckCircle2,
  COURSE_STARTED: BookOpen,
}

const typeColors = {
  LECTURE_COMPLETED: "text-blue-500",
  ASSIGNMENT_SUBMITTED: "text-green-500",
  QUIZ_COMPLETED: "text-purple-500",
  COURSE_STARTED: "text-orange-500",
}

export function ProgressTimeline({ items, className }: ProgressTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const Icon = typeIcons[item.type] || HelpCircle
        const colorClass = typeColors[item.type] || "text-gray-500"

        return (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "rounded-full p-2 bg-background border-2",
                  colorClass,
                  "border-current"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < items.length - 1 && (
                <div className="w-0.5 h-full bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{item.title}</h4>
                {item.courseTitle && (
                  <span className="text-sm text-muted-foreground">
                    • {item.courseTitle}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {item.description}
              </p>
              <time className="text-xs text-muted-foreground">
                {formatDate(item.timestamp)}
              </time>
            </div>
          </div>
        )
      })}
    </div>
  )
}

