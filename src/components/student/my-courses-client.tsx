"use client"

import { useState, useMemo } from "react"
import { CourseList } from "@/components/shared/course-list"
import { CourseFilters, type CourseStatus } from "@/components/shared/course-filters"
import { CourseSearch } from "@/components/shared/course-search"
import type { Course } from "@/lib/types"
import type { CourseProgress } from "@/lib/types"

interface MyCoursesClientProps {
  courses: Course[]
  progress: Record<string, CourseProgress>
}

export function MyCoursesClient({
  courses,
  progress,
}: MyCoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<CourseStatus>("all")

  const filteredCourses = useMemo(() => {
    let filtered = courses

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => {
        const courseProgress = progress[course.id]
        if (!courseProgress) {
          return statusFilter === "not-started"
        }

        const percentage = courseProgress.progressPercentage
        if (statusFilter === "completed") {
          return percentage === 100
        }
        if (statusFilter === "in-progress") {
          return percentage > 0 && percentage < 100
        }
        if (statusFilter === "not-started") {
          return percentage === 0
        }
        return true
      })
    }

    return filtered
  }, [courses, progress, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">
          Continue learning from where you left off
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <CourseSearch
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <CourseFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      <CourseList
        courses={filteredCourses}
        progress={progress}
        getHref={(course) => `/student/courses/${course.id}`}
      />
    </div>
  )
}

