import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { InstructorSidebar } from "@/components/instructor/instructor-sidebar"

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  let user: User | null = null
  try {
    user = await apiGet<User>("/users/me", { requireAuth: true })

    // Allow both instructors and admins to access instructor routes
    // Admins need access to manage courses and assign instructors
    const allowedRoles = ["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"]
    if (!allowedRoles.includes(user.role.toUpperCase())) {
      redirect("/access-denied")
    }
  } catch (error) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background">
        <InstructorSidebar role={user?.role || "Instructor"} />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

