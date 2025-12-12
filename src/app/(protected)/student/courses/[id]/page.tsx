import { Suspense } from "react"
import { notFound } from "next/navigation"
import {
  getCourseDetails,
  getCourseModules,
} from "@/lib/server/student-api"
import { CourseDetailClient } from "@/components/student/course-detail-client"
import { Skeleton } from "@/components/ui/skeleton"

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const [course, modules] = await Promise.all([
      getCourseDetails(id),
      getCourseModules(id),
    ])

    return (
      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseDetailClient course={course} modules={modules} />
      </Suspense>
    )
  } catch (error) {
    notFound()
  }
}

