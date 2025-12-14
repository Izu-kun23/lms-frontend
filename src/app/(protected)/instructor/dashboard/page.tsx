import { Suspense } from "react"
import { fetchInstructorDashboard, getRecentEnrollments } from "@/lib/server/instructor-api"
import { apiGet } from "@/lib/server/api-client"
import { InstructorDashboardClient } from "@/components/instructor/instructor-dashboard-client"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/lib/types"

function InstructorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  )
}

export default async function InstructorDashboardPage() {
  try {
    // Get current user first to filter courses by instructor ID
    // This ensures instructors only see courses they are assigned to
    // Admins will see all courses (no filtering by instructorId)
    const user = await apiGet<User>("/users/me", { requireAuth: true }).catch(() => null)
    
    if (!user?.id) {
      throw new Error("User not found or not authenticated")
    }
    
    // For admins, don't pass instructorId at all to prevent backend from filtering
    // For instructors, pass their ID so they only see their assigned courses
    const isAdmin = user.role.toUpperCase() === "ADMIN" || user.role.toUpperCase() === "SUPER_ADMIN"
    const [data, enrollments] = await Promise.all([
      fetchInstructorDashboard(isAdmin ? undefined : user.id, user.role),
      getRecentEnrollments().catch(() => []),
    ])

    return (
      <Suspense fallback={<InstructorDashboardSkeleton />}>
        <InstructorDashboardClient
          courses={data.courses || []}
          stats={data.stats || null}
          pendingSubmissions={data.pendingSubmissions || []}
          recentEnrollments={enrollments}
          user={user}
        />
      </Suspense>
    )
  } catch (error) {
    console.error("Failed to fetch instructor dashboard data:", error)
    // If API fails, show empty dashboard
    return (
      <InstructorDashboardClient
        courses={[]}
        stats={null}
        pendingSubmissions={[]}
        recentEnrollments={[]}
        user={null}
      />
    )
  }
}

