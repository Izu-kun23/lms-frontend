"use client"

import { Clock, BookOpen, CheckCircle, FileText, Award } from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityType = "course" | "assignment" | "quiz" | "achievement" | "progress"

export type ActivityItem = {
  id: string
  type: ActivityType
  title: string
  description?: string
  timestamp: string
  courseName?: string
}

type ActivityFeedProps = {
  activities: ActivityItem[]
  maxItems?: number
  className?: string
}

const activityIcons = {
  course: BookOpen,
  assignment: FileText,
  quiz: FileText,
  achievement: Award,
  progress: CheckCircle,
}

const activityColors = {
  course: "text-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
  assignment: "text-orange-500 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400",
  quiz: "text-purple-500 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400",
  achievement: "text-green-500 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
  progress: "text-teal-500 bg-teal-50 dark:bg-teal-950/30 dark:text-teal-400",
}

function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`
}

export function ActivityFeed({
  activities,
  maxItems = 10,
  className,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems)

  return (
    <div className={cn("space-y-4", className)}>
      {displayedActivities.map((activity) => {
        const Icon = activityIcons[activity.type]
        const colorClass = activityColors[activity.type]

        return (
          <div
            key={activity.id}
            className="flex gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
          >
            <div className={cn("rounded-lg p-2 shrink-0", colorClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                {activity.title}
              </p>
              {activity.description && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
                  {activity.description}
                </p>
              )}
              {activity.courseName && (
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2">
                  Course: {activity.courseName}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(activity.timestamp))}</span>
              </div>
            </div>
          </div>
        )
      })}
      {activities.length === 0 && (
        <div className="text-center py-8 text-sm text-neutral-500 dark:text-neutral-400">
          No recent activity
        </div>
      )}
    </div>
  )
}

