import { Suspense } from "react"
import { getEnrolledCourses, getOverallProgress } from "@/lib/server/student-api"
import { CourseList } from "@/components/shared/course-list"
import { CourseFilters, type CourseStatus } from "@/components/shared/course-filters"
import { CourseSearch } from "@/components/shared/course-search"
import { MyCoursesClient } from "@/components/student/my-courses-client"
import { CourseListSkeleton } from "@/components/shared/course-list"
import { Skeleton } from "@/components/ui/skeleton"

function MyCoursesSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>
      <CourseListSkeleton />
    </div>
  )
}

export default async function MyCoursesPage() {
  const [courses, progressData] = await Promise.all([
    getEnrolledCourses(),
    getOverallProgress().catch(() => ({ courses: [] })),
  ])

  const progress = Object.fromEntries(
    progressData.courses?.map((p) => [p.courseId, p]) || []
  )

  return (
    <Suspense fallback={<MyCoursesSkeleton />}>
      <MyCoursesClient courses={courses} progress={progress} />
    </Suspense>
  )
}

