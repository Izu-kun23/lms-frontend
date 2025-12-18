import { notFound } from "next/navigation"
import { getCourseDetails } from "@/lib/server/instructor-api"
import { EditCourseClient } from "@/components/instructor/edit-course-client"

interface EditCoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params

  const course = await getCourseDetails(id).catch((error) => {
    console.error(`Failed to load course ${id}:`, error)
    return null
  })

  if (!course) {
    notFound()
  }

  return <EditCourseClient course={course} />
}
