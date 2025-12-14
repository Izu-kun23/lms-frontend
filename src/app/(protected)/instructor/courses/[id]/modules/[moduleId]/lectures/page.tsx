import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCourseDetails, getCourseModules } from "@/lib/server/instructor-api"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { InstructorModuleLecturesClient } from "@/components/instructor/instructor-module-lectures-client"
import { Skeleton } from "@/components/ui/skeleton"
import type { CourseWithModules } from "@/types/course"
import type { Module, Lecture } from "@/types/course"

function LecturesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}

export default async function InstructorModuleLecturesPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string }>
}) {
  const { id: courseId, moduleId } = await params

  try {
    const [course, modules] = await Promise.all([
      getCourseDetails(courseId),
      getCourseModules(courseId).catch(() => []),
    ])

    // Find the specific module
    const module = modules.find((m) => m.id === moduleId)
    if (!module) {
      notFound()
    }

    // Fetch lectures for this module
    const lectures = await apiGet<Array<{
      id: string
      title: string
      index: number
      moduleId: string
    }>>(`/courses/modules/${moduleId}/lectures`, {
      requireAuth: true,
    }).catch(() => [])

    // Map API response to Lecture type
    const mappedLectures: Lecture[] = lectures.map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      moduleId: lecture.moduleId,
      order: lecture.index,
      type: "TEXT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

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
      }
    }

    return (
      <Suspense fallback={<LecturesSkeleton />}>
        <InstructorModuleLecturesClient
          course={courseWithInstructor}
          module={module}
          lectures={mappedLectures}
        />
      </Suspense>
    )
  } catch (error) {
    console.error("Failed to fetch module lectures:", error)
    notFound()
  }
}

