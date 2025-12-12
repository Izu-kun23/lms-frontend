import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getLectureContents } from "@/lib/server/student-api"
import { apiGet } from "@/lib/server/api-client"
import type { Lecture } from "@/types/course"
import { LectureDetailClient } from "@/components/student/lecture-detail-client"
import { Skeleton } from "@/components/ui/skeleton"

function LectureDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default async function LectureDetailPage({
  params,
}: {
  params: Promise<{ id: string; lectureId: string }>
}) {
  const { id: courseId, lectureId } = await params

  try {
    // Try to get lecture details, but if endpoint doesn't exist, we'll use a minimal lecture object
    const [lectureResponse, contents] = await Promise.all([
      apiGet<Lecture>(`/courses/lectures/${lectureId}`, {
        requireAuth: true,
      }).catch(() => null),
      getLectureContents(lectureId),
    ])

    // If we can't get lecture details, create a minimal lecture object
    // The lecture ID is enough to display the page
    const lecture: Lecture = lectureResponse || {
      id: lectureId,
      moduleId: "",
      title: "Lecture",
      type: "TEXT",
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return (
      <Suspense fallback={<LectureDetailSkeleton />}>
        <LectureDetailClient
          courseId={courseId}
          lecture={lecture}
          contents={contents}
        />
      </Suspense>
    )
  } catch (error) {
    console.error("Error fetching lecture:", error)
    notFound()
  }
}

