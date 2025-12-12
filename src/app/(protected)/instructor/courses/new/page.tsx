import { redirect } from "next/navigation"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { CreateCourseClient } from "@/components/instructor/create-course-client"

export default async function CreateCoursePage() {
  // Get current user to access schoolId
  const user = await apiGet<User>("/users/me", { requireAuth: true })

  if (!user?.schoolId) {
    redirect("/instructor/courses")
  }

  return <CreateCourseClient schoolId={user.schoolId} />
}

