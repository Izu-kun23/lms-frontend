import { Suspense } from "react"
import { fetchStudentDashboard, getRecentActivity } from "@/lib/server/student-api"
import { apiGet } from "@/lib/server/api-client"
import { StudentDashboardClient } from "@/components/student/student-dashboard-client"
import { CourseListSkeleton } from "@/components/shared/course-list"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/lib/types"
import type { ProgressActivity } from "@/types/progress"
import type { ActivityItem } from "@/components/shared/activity-feed"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <CourseListSkeleton count={6} />
      </div>
    </div>
  )
}

function mapProgressActivityToActivityItem(
  activity: ProgressActivity
): ActivityItem {
  const typeMap: Record<
    ProgressActivity["type"],
    "course" | "assignment" | "quiz" | "achievement" | "progress"
  > = {
    LECTURE_COMPLETED: "progress",
    ASSIGNMENT_SUBMITTED: "assignment",
    QUIZ_COMPLETED: "quiz",
    COURSE_STARTED: "course",
  }

  return {
    id: activity.id,
    type: typeMap[activity.type] || "progress",
    title: activity.description,
    timestamp: activity.createdAt,
    courseName: activity.courseTitle,
  }
}

export default async function StudentDashboardPage() {
  try {
    const [data, activities, user] = await Promise.all([
      fetchStudentDashboard(),
      getRecentActivity().catch(() => [] as ProgressActivity[]),
      apiGet<User>("/users/me", { requireAuth: true }).catch(() => null),
    ])

    const activityItems = activities.map(mapProgressActivityToActivityItem)

    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <StudentDashboardClient
          courses={data.courses || []}
          progress={data.progress || []}
          upcomingAssignments={data.upcomingAssignments || []}
          activities={activityItems}
          user={user}
        />
      </Suspense>
    )
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    // If API fails, show empty dashboard
    return (
      <StudentDashboardClient
        courses={[]}
        progress={[]}
        upcomingAssignments={[]}
        activities={[]}
        user={null}
      />
    )
  }
}

