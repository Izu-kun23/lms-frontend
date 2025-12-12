"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen, Clock, User, Play } from "lucide-react"
import { ProgressBar } from "./progress-bar"
import type { Course } from "@/lib/types"
import type { CourseProgress } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: Course
  progress?: CourseProgress
  showProgress?: boolean
  href?: string
  className?: string
}

export function CourseCard({
  course,
  progress,
  showProgress = true,
  href,
  className,
}: CourseCardProps) {
  const progressPercentage = progress?.progressPercentage || 0
  const status: "in-progress" | "completed" | "not-started" =
    progressPercentage === 100
      ? "completed"
      : progressPercentage > 0
        ? "in-progress"
        : "not-started"

  const instructorName = course.instructor
    ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim() ||
      "Unknown Instructor"
    : "Unknown Instructor"

  const statusBadgeStyles = {
    "in-progress": "bg-blue-softer border-blue-subtle text-fg-blue-strong",
    completed: "bg-green-softer border-green-subtle text-fg-green-strong",
    "not-started": "bg-neutral-softer border-neutral-subtle text-fg-neutral-strong",
  }

  const cardContent = (
    <Link
      href={href || `/student/courses/${course.id}`}
      className={cn(
        "flex flex-col bg-neutral-primary-soft p-4 border border-default rounded-2xl shadow-xs hover:shadow-sm transition-shadow duration-200 overflow-hidden",
        className
      )}
    >
      {course.coverUrl ? (
        <div className="relative w-full h-40 mb-3 overflow-hidden">
          <Image
            src={course.coverUrl}
            alt={course.title}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      ) : (
        <div className="w-full h-40 mb-3 bg-muted rounded-xl flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
      )}

      <div className="flex flex-col justify-between flex-1 leading-normal">
        <div>
          <h5 className="mb-2 text-lg font-bold tracking-tight text-heading line-clamp-2">
            {course.title}
          </h5>
          
          {course.summary && (
            <p className="mb-3 text-sm text-body line-clamp-2">
              {course.summary}
            </p>
          )}

          {course.code && (
            <p className="mb-2 text-xs text-fg-neutral font-mono">
              {course.code}
            </p>
          )}

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-fg-neutral">
              <User className="h-3.5 w-3.5 text-brand shrink-0" />
              <span className="truncate">{instructorName}</span>
            </div>
            {progress?.lastAccessedAt && (
              <div className="flex items-center gap-1.5 text-xs text-fg-neutral-soft">
                <Clock className="h-3.5 w-3.5 text-fg-neutral-softer shrink-0" />
                <span className="truncate">
                  {new Date(progress.lastAccessedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {showProgress && progress && progressPercentage > 0 && (
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-fg-neutral">Progress</span>
                <span className="font-semibold text-heading">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <ProgressBar value={progressPercentage} showLabel={false} className="h-1.5" />
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            className="inline-flex items-center w-full justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-xl text-sm px-3 py-2 focus:outline-none"
          >
            {progressPercentage > 0 ? "Continue" : "Start"}
            <Play className="w-3.5 h-3.5 ms-1.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </Link>
  )

  return cardContent
}