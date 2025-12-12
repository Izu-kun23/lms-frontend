import { Suspense } from "react"
import { getOverallProgress } from "@/lib/server/student-api"
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
  const progressData = await getOverallProgress()

  return (
    <Suspense fallback={<ProgressSkeleton />}>
      <ProgressDashboardClient progress={progressData} />
    </Suspense>
  )
}

