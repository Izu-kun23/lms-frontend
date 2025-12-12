import { Suspense } from "react"
import { getInstructorStudents } from "@/lib/server/instructor-api"
import { StudentsClient } from "@/components/instructor/students-client"
import { Skeleton } from "@/components/ui/skeleton"

function StudentsSkeleton() {
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

export default async function InstructorStudentsPage() {
  const students = await getInstructorStudents()

  return (
    <Suspense fallback={<StudentsSkeleton />}>
      <StudentsClient students={students} />
    </Suspense>
  )
}

