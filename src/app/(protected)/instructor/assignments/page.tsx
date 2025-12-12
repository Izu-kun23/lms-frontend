import { Suspense } from "react"
import { getInstructorAssignments } from "@/lib/server/instructor-api"
import { AssignmentsManagementClient } from "@/components/instructor/assignments-management-client"
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

export default async function InstructorAssignmentsPage() {
  const assignments = await getInstructorAssignments()

  return (
    <Suspense fallback={<AssignmentsSkeleton />}>
      <AssignmentsManagementClient assignments={assignments} />
    </Suspense>
  )
}

