import { redirect } from "next/navigation"
import { apiGet } from "@/lib/server/api-client"
import { getInstructorCourses } from "@/lib/server/instructor-api"
import type { User } from "@/lib/types"
import { CreateAssignmentClient } from "@/components/instructor/create-assignment-client"

export default async function CreateAssignmentPage() {
  const user = await apiGet<User>("/users/me", { requireAuth: true }).catch(() => null)

  if (!user) {
    redirect("/login")
  }

  const isAdmin = user.role.toUpperCase() === "ADMIN" || user.role.toUpperCase() === "SUPER_ADMIN"

  const courses = await getInstructorCourses(
    isAdmin ? undefined : user.id,
    user.role
  ).catch(() => [])

  return <CreateAssignmentClient courses={courses} />
}
