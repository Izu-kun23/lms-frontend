"use client"

import { CourseCard } from "./course-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Course } from "@/lib/types"
import type { CourseProgress } from "@/lib/types"

interface CourseListProps {
  courses: Course[]
  progress?: Record<string, CourseProgress>
  showProgress?: boolean
  getHref?: (course: Course) => string
  className?: string
}

export function CourseList({
  courses,
  progress,
  showProgress = true,
  getHref,
  className,
}: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No courses found</p>
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className || ""}`}
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          progress={progress?.[course.id]}
          showProgress={showProgress}
          href={getHref?.(course)}
        />
      ))}
    </div>
  )
}

export function CourseListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  )
}

