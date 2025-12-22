import { notFound } from "next/navigation"
import { getAssignmentDetails } from "@/lib/server/student-api"
import { StudentAssignmentDetailClient } from "@/components/student/assignment-detail-client"

interface AssignmentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StudentAssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const { id } = await params

  const assignment = await getAssignmentDetails(id).catch((error) => {
    console.error(`Failed to load assignment ${id}:`, error)
    return null
  })

  if (!assignment) {
    notFound()
  }

  return <StudentAssignmentDetailClient assignment={assignment} />
}


