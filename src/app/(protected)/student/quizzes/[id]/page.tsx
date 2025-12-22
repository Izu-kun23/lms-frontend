import { notFound } from "next/navigation"
import { getQuizDetails } from "@/lib/server/student-api"
import { StudentQuizDetailClient } from "@/components/student/quiz-detail-client"

interface QuizDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StudentQuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params

  const quiz = await getQuizDetails(id).catch((error) => {
    console.error(`Failed to load quiz ${id}:`, error)
    return null
  })

  if (!quiz) {
    notFound()
  }

  return <StudentQuizDetailClient quiz={quiz} />
}
