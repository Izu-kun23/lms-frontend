"use client"

import { BookOpen, Users, FileText, TrendingUp, GraduationCap, Plus } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Course } from "@/lib/types"
import type { InstructorDashboardStats } from "@/types/analytics"
import type { SubmissionWithDetails } from "@/types/assignment"
import type { User } from "@/lib/types"
import Link from "next/link"

interface InstructorDashboardClientProps {
  courses: Course[]
  stats: InstructorDashboardStats | null
  pendingSubmissions: SubmissionWithDetails[]
  recentEnrollments?: any[]
  user?: User | null
}

export function InstructorDashboardClient({
  courses,
  stats,
  pendingSubmissions,
  recentEnrollments = [],
  user,
}: InstructorDashboardClientProps) {
  const firstName = user?.firstName || "there"
  const totalCourses = stats?.totalCourses || courses.length
  const activeStudents = stats?.totalStudents || 0
  const totalEnrollments = stats?.totalEnrollments || 0
  const pendingGrading = stats?.pendingGradings || pendingSubmissions.length

  return (
    <div className="flex flex-1 gap-6 bg-white dark:bg-neutral-900 h-full overflow-hidden">
      <div className="flex-1 min-w-0 px-6 pt-6 pb-6 overflow-y-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Hello {firstName} 👋
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage your courses and students.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              <Link href="/instructor/courses">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/instructor/students">View Students</Link>
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <StatCard
            label="Total Courses"
            value={totalCourses}
            icon={BookOpen}
            variant="blue"
          />
          <StatCard
            label="Active Students"
            value={activeStudents}
            icon={Users}
            variant="purple"
          />
          <StatCard
            label="Total Enrollments"
            value={totalEnrollments}
            icon={GraduationCap}
            variant="green"
          />
          <StatCard
            label="Pending Grading"
            value={pendingGrading}
            icon={FileText}
            variant="orange"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* My Courses Table */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              My Courses
            </h2>
            <Card>
              <CardContent className="p-0">
                {courses.length > 0 ? (
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {courses.slice(0, 5).map((course) => (
                      <Link
                        key={course.id}
                        href={`/instructor/courses/${course.id}`}
                        className="block p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                              {course.title}
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {course.code}
                            </p>
                          </div>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            View →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      No courses yet
                    </p>
                    <Button
                      asChild
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Link href="/instructor/courses">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Course
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Enrollments Feed */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Enrollments
            </h2>
            <Card>
              <CardContent className="p-0">
                {recentEnrollments.length > 0 ? (
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {recentEnrollments.slice(0, 5).map((enrollment: any) => (
                      <div
                        key={enrollment.id || enrollment.enrollmentId}
                        className="p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">
                              {enrollment.student?.firstName || enrollment.user?.firstName}{" "}
                              {enrollment.student?.lastName || enrollment.user?.lastName}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {enrollment.course?.title || enrollment.courseTitle}
                            </p>
                            {enrollment.enrolledAt && (
                              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                                {new Date(enrollment.enrolledAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No recent enrollments
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Performance Chart */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Student Performance
            </h2>
            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                Chart component coming soon
              </p>
            </div>
          </div>

          {/* Course Analytics Chart */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Course Analytics
            </h2>
            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                Chart component coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

