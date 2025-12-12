"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseList } from "@/components/shared/course-list"
import type { Course } from "@/lib/types"
import Link from "next/link"

interface CoursesManagementClientProps {
  courses: Course[]
}

export function CoursesManagementClient({
  courses,
}: CoursesManagementClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and content
          </p>
        </div>
        <Button asChild>
          <Link href="/instructor/courses/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      <CourseList
        courses={courses}
        getHref={(course) => `/instructor/courses/${course.id}`}
        showProgress={false}
      />
    </div>
  )
}

