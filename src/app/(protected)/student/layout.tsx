import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { StudentSidebar } from "@/components/student/student-sidebar"

export default async function StudentLayout({
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

    if (user.role.toUpperCase() !== "STUDENT") {
      redirect("/access-denied")
    }
  } catch (error) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background">
        <StudentSidebar role={user?.role || "Student"} />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

