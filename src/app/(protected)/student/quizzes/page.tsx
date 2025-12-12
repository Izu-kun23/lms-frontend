import { Suspense } from "react"
import { getMyQuizzes } from "@/lib/server/student-api"
import { QuizzesClient } from "@/components/student/quizzes-client"
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

export default async function QuizzesPage() {
  const quizzes = await getMyQuizzes()

  return (
    <Suspense fallback={<QuizzesSkeleton />}>
      <QuizzesClient quizzes={quizzes} />
    </Suspense>
  )
}

