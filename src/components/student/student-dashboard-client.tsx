"use client"

import { CourseCard } from "@/components/shared/course-card"
import { StatCard } from "@/components/shared/stat-card"
import { ActivityFeed, type ActivityItem } from "@/components/shared/activity-feed"
import { AssignmentCard } from "@/components/shared/assignment-card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Course } from "@/lib/types"
import type { CourseProgress } from "@/lib/types"
import type { AssignmentWithCourse } from "@/types/assignment"
import type { User } from "@/lib/types"

interface StudentDashboardClientProps {
  courses: Course[]
  progress: CourseProgress[]
  upcomingAssignments: AssignmentWithCourse[]
  activities?: ActivityItem[]
  user?: User | null
}

function getAssignmentStatus(
  assignment: AssignmentWithCourse
): "pending" | "submitted" | "graded" | "overdue" {
  // Check if assignment has a submission with status
  const submission = (assignment as any).submission
  if (submission) {
    if (submission.status === "GRADED") return "graded"
    if (submission.status === "SUBMITTED") return "submitted"
  }

  // Check if overdue
  if (assignment.dueAt) {
    const dueDate = new Date(assignment.dueAt)
    const now = new Date()
    if (now > dueDate && !submission) {
      return "overdue"
    }
  }

  return "pending"
}

export function StudentDashboardClient({
  courses,
  progress,
  upcomingAssignments,
  activities = [],
  user,
}: StudentDashboardClientProps) {
  const overallProgress =
    progress.length > 0
      ? progress.reduce((sum, p) => sum + p.progressPercentage, 0) /
        progress.length
      : 0

  const enrolledCourses = courses.length
  const pendingAssignments = upcomingAssignments.filter(
    (a) => getAssignmentStatus(a) === "pending" || getAssignmentStatus(a) === "overdue"
  ).length

  const firstName = user?.firstName || "there"

  return (
    <div className="flex flex-1 gap-6 bg-white dark:bg-neutral-900 h-full overflow-hidden">
      <div className="flex-1 min-w-0 px-6 pt-6 pb-6 overflow-y-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            Hello {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Welcome back! Continue your learning journey.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <StatCard
            label="Enrolled Courses"
            value={enrolledCourses}
            icon={BookOpen}
            variant="blue"
          />
          <StatCard
            label="Overall Progress"
            value={`${Math.round(overallProgress)}%`}
            icon={TrendingUp}
            variant="teal"
          />
          <StatCard
            label="Pending Assignments"
            value={pendingAssignments}
            icon={FileText}
            variant="orange"
          />
        </div>

        {/* My Courses - Full Width */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              My Courses
            </h2>
            {courses.length > 3 && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="inline-flex items-center text-sm"
              >
                <Link href="/student/my-courses">
                  View more
                  <ArrowRight className="w-4 h-4 ms-1.5" />
                </Link>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 3).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress.find((p) => p.courseId === course.id)}
                showProgress={true}
                href={`/student/courses/${course.id}`}
              />
            ))}
          </div>
        </div>

        {/* Charts and Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Study Hours Chart - Placeholder for now */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Study Hours
            </h2>
            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                Chart component coming soon
              </p>
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Upcoming Assignments
            </h2>
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAssignments.slice(0, 3).map((assignment) => {
                  const status = getAssignmentStatus(assignment)
                  const submission = (assignment as any).submission
                  return (
                    <AssignmentCard
                      key={assignment.id}
                      id={assignment.id}
                      title={assignment.title}
                      courseName={assignment.course?.title || "Unknown Course"}
                      dueAt={assignment.dueAt || new Date().toISOString()}
                      status={status}
                      score={submission?.grade}
                      maxScore={(assignment as any).maxScore}
                      submittedAt={submission?.submittedAt}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No upcoming assignments
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity - Moved Down */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Recent Activity
          </h2>
          <ActivityFeed activities={activities} maxItems={5} />
        </div>

      </div>
    </div>
  )
}

