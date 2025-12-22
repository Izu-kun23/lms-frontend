import { Suspense } from "react"
import { notFound } from "next/navigation"
import {
  getCourseDetails,
  getCourseModules,
  getStudentDetails,
  getCourseProgress,
} from "@/lib/server/instructor-api"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { InstructorCourseDetailClient } from "@/components/instructor/instructor-course-detail-client"
import { Skeleton } from "@/components/ui/skeleton"
import type { CourseWithModules } from "@/types/course"

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}

export default async function InstructorCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const [course, modules, progress] = await Promise.all([
      getCourseDetails(id),
      getCourseModules(id).catch(() => []),
      getCourseProgress(id).catch(() => null),
    ])

    // If instructor info is not included in the course, fetch it
    let courseWithInstructor: CourseWithModules = course
    if (course.instructorId && !course.instructor) {
      try {
        const instructor = await apiGet<User>(`/users/${course.instructorId}`, {
          requireAuth: true,
        })
        courseWithInstructor = {
          ...course,
          instructor: {
            id: instructor.id,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
          },
        }
      } catch (error) {
        console.error("Failed to fetch instructor:", error)
        // If fetching instructor fails, try to get current user (might be the instructor)
        try {
          const currentUser = await apiGet<User>("/users/me", {
            requireAuth: true,
          })
          if (currentUser.id === course.instructorId) {
            courseWithInstructor = {
              ...course,
              instructor: {
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
              },
            }
          }
        } catch (userError) {
          console.error("Failed to fetch current user:", userError)
        }
      }
    }

    return (
      <Suspense fallback={<CourseDetailSkeleton />}>
        <InstructorCourseDetailClient
          course={courseWithInstructor}
          modules={modules}
          progress={progress || undefined}
        />
      </Suspense>
    )
  } catch (error) {
    console.error("Failed to fetch course:", error)
    notFound()
  }
}

