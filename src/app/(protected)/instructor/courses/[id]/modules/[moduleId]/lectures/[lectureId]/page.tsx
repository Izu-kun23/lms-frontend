import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCourseDetails, getCourseModules, getModuleLectures } from "@/lib/server/instructor-api"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { InstructorLectureDetailClient } from "@/components/instructor/instructor-lecture-detail-client"
import { Skeleton } from "@/components/ui/skeleton"
import type { CourseWithModules } from "@/types/course"
import type { Module, Lecture, Content } from "@/types/course"

function LectureDetailSkeleton() {
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

export default async function InstructorLectureDetailPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string; lectureId: string }>
}) {
  const { id: courseId, moduleId, lectureId } = await params

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
    const lectures = await getModuleLectures(moduleId).catch(() => [])
    const lecture = lectures.find((l) => l.id === lectureId)
    if (!lecture) {
      notFound()
    }

    // Fetch contents for this lecture
    const contents = await apiGet<Array<{
      id: string
      kind: string
      text?: string
      mediaUrl?: string
      metadata?: Record<string, any>
      index: number
      lectureId: string
      createdAt?: string
      updatedAt?: string
    }>>(`/courses/lectures/${lectureId}/contents`, {
      requireAuth: true,
    }).catch(() => [])

    // Map API response to Content type
    const mappedContents: Content[] = contents.map((content) => ({
      id: content.id,
      lectureId: content.lectureId,
      type: content.kind as Content["type"],
      text: content.text,
      mediaUrl: content.mediaUrl,
      metadata: content.metadata,
      order: content.index,
      createdAt: content.createdAt || new Date().toISOString(),
      updatedAt: content.updatedAt || new Date().toISOString(),
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
      <Suspense fallback={<LectureDetailSkeleton />}>
        <InstructorLectureDetailClient
          course={courseWithInstructor}
          module={module}
          lecture={lecture}
          contents={mappedContents}
        />
      </Suspense>
    )
  } catch (error) {
    console.error("Failed to fetch lecture details:", error)
    notFound()
  }
}

