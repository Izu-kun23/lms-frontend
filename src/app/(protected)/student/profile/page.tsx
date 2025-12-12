import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { ProfileClient } from "@/components/student/profile-client"

export default async function StudentProfilePage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  let user: User | null = null
  try {
    user = await apiGet<User>("/users/me", { requireAuth: true })

    if (user.role.toUpperCase() !== "STUDENT") {
      redirect("/access-denied")
    }
  } catch (error) {
    redirect("/login")
  }

  return <ProfileClient user={user} />
}

