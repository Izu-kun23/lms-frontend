"use client"

import { Clock, BookOpen, PlayCircle, Timer, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/shared/progress-bar"
import type { CourseProgress, Course } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CourseProgressCardProps {
  progress: CourseProgress
  courseId: string
  course?: Course
  showContinueButton?: boolean
  showViewCourseButton?: boolean
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

export function CourseProgressCard({
  progress,
  courseId,
  course,
  showContinueButton = false,
  showViewCourseButton = false,
}: CourseProgressCardProps) {
  const lastActivityLabel = progress.lastActivityAt
    ? DATE_FORMATTER.format(new Date(progress.lastActivityAt))
    : progress.lastAccessedAt
    ? DATE_FORMATTER.format(new Date(progress.lastAccessedAt))
    : "Never"

  const courseTitle = course?.title || progress.courseTitle
  const courseCode = course?.code || progress.courseCode

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {courseTitle}
            </CardTitle>
            {courseCode && (
              <p className="text-sm text-muted-foreground mt-1">{courseCode}</p>
            )}
          </div>
          {showViewCourseButton && (
            <Button variant="outline" size="sm" asChild className="rounded-full">
              <Link href={`/student/courses/${courseId}`}>
                View Course
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-semibold">
              {Math.round(progress.progressPercentage)}%
            </span>
          </div>
          <ProgressBar value={progress.progressPercentage} className="h-2" />
        </div>

        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Last Activity</span>
          </div>
          <p className="text-sm font-medium truncate">{lastActivityLabel}</p>
        </div>

        {progress.currentLectureId && (
          <div className="rounded-lg border bg-orange-50 dark:bg-orange-950/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <PlayCircle className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-900 dark:text-orange-100">
                Current Lecture
              </span>
            </div>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              You can continue from where you left off
            </p>
          </div>
        )}

        {progress.session && (
          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900 dark:text-blue-100">
                  Active Session
                </span>
              </div>
              {progress.session.endTime ? (
                <Badge variant="secondary" className="text-xs">
                  Completed
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs bg-blue-600">
                  Active
                </Badge>
              )}
            </div>
            <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <p>
                Started: {DATE_FORMATTER.format(new Date(progress.session.startTime))}
              </p>
              {progress.session.duration && (
                <p>
                  Duration: {Math.floor(progress.session.duration / 60)} minutes
                </p>
              )}
              {progress.session.lectureId && (
                <p className="font-medium">Lecture ID: {progress.session.lectureId}</p>
              )}
            </div>
          </div>
        )}

        {showContinueButton && progress.currentLectureId && (
          <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 rounded-full">
            <Link href={`/student/courses/${courseId}/lectures/${progress.currentLectureId}`}>
              Continue Learning
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
