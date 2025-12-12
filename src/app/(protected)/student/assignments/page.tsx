import { Suspense } from "react"
import { getMyAssignments } from "@/lib/server/student-api"
import { AssignmentsClient } from "@/components/student/assignments-client"
import { Skeleton } from "@/components/ui/skeleton"

function AssignmentsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  )
}

export default async function AssignmentsPage() {
  const assignments = await getMyAssignments()

  return (
    <Suspense fallback={<AssignmentsSkeleton />}>
      <AssignmentsClient assignments={assignments} />
    </Suspense>
  )
}

