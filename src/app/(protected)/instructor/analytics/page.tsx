import { Suspense } from "react"
import { AnalyticsClient } from "@/components/instructor/analytics-client"
import { Skeleton } from "@/components/ui/skeleton"

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default async function InstructorAnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsClient />
    </Suspense>
  )
}

