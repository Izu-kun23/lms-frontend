import { notFound } from "next/navigation"
import { AssignmentDetailClient } from "@/components/instructor/assignment-detail-client"
import { getInstructorAssignmentById } from "@/lib/server/instructor-api"

interface AssignmentDetailPageProps {
  params: Promise<{
    assignmentId: string
  }>
}

export default async function AssignmentDetailPage({ params }: AssignmentDetailPageProps) {
  const { assignmentId } = await params

  const assignment = await getInstructorAssignmentById(assignmentId).catch((error) => {
    console.error(`Failed to load assignment ${assignmentId}:`, error)
    return null
  })

  if (!assignment) {
    notFound()
  }

  return <AssignmentDetailClient assignment={assignment} />
}
