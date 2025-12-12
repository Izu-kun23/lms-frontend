import { Suspense } from "react"
import { getInstructorQuizzes } from "@/lib/server/instructor-api"
import { QuizzesManagementClient } from "@/components/instructor/quizzes-management-client"
import { Skeleton } from "@/components/ui/skeleton"

function QuizzesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  )
}

export default async function InstructorQuizzesPage() {
  const quizzes = await getInstructorQuizzes()

  return (
    <Suspense fallback={<QuizzesSkeleton />}>
      <QuizzesManagementClient quizzes={quizzes} />
    </Suspense>
  )
}

