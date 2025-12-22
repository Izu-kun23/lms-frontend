import { Suspense } from "react"
import { getOverallProgress, getEnrolledCourses, getCourseProgressWithSession } from "@/lib/server/student-api"
import { ProgressDashboardClient } from "@/components/student/progress-dashboard-client"
import { Skeleton } from "@/components/ui/skeleton"

function ProgressSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default async function ProgressPage() {
  const [progressData, courses] = await Promise.all([
    getOverallProgress(),
    getEnrolledCourses().catch(() => []),
  ])

  // Fetch detailed progress with session data for each course
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      try {
        const courseProgress = await getCourseProgressWithSession(course.id)
        return {
          course,
          progress: courseProgress,
        }
      } catch (error) {
        console.error(`Failed to fetch progress for course ${course.id}:`, error)
        return {
          course,
          progress: null,
        }
      }
    })
  )

  return (
    <Suspense fallback={<ProgressSkeleton />}>
      <ProgressDashboardClient 
        progress={progressData} 
        coursesWithProgress={coursesWithProgress}
      />
    </Suspense>
  )
}

