"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { Course, CourseProgress, ResumeData } from "@/lib/types"
import { ResumeCard } from "@/components/student/resume-card"
import { Button } from "@/components/ui/button"
import { StudentHeader } from "@/components/student/student-header"
import { DashboardStatCard } from "@/components/student/dashboard-stat-cards"
import { ActiveCoursesTable } from "@/components/student/active-courses-table"
import { CourseProgressCard } from "@/components/student/course-progress-card"
import { InstructorsSection } from "@/components/student/instructors-section"
import { HelpSupportCard } from "@/components/student/help-support-card"
import { UpcomingDeadlines } from "@/components/student/upcoming-deadlines"

export default function StudentDashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch courses
  const {
    data: courses = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery<Course[]>({
    queryKey: ["courses", user?.organizationId],
    queryFn: () => apiClient.getCourses(user?.organizationId),
    enabled: !!user?.organizationId,
  })

  // Fetch progress
  const {
    data: progress = [],
    isLoading: progressLoading,
  } = useQuery<CourseProgress[]>({
    queryKey: ["progress", "me"],
    queryFn: () => apiClient.getMyProgress(),
    enabled: !!user,
  })

  // Fetch resume data
  const {
    data: resumeData = [],
    isLoading: resumeLoading,
  } = useQuery<ResumeData[]>({
    queryKey: ["progress", "resume"],
    queryFn: () => apiClient.getResumeData(),
    enabled: !!user,
  })

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Create a map of courseId -> progress for quick lookup
  const progressMap = new Map<string, CourseProgress>()
  progress.forEach((p) => {
    progressMap.set(p.courseId, p)
  })

  // Get enrolled courses (courses with progress)
  const enrolledCourseIds = new Set(progress.map((p) => p.courseId))
  const enrolledCourses = courses.filter((course) => enrolledCourseIds.has(course.id))

  // Calculate stats
  const totalCourses = enrolledCourses.length
  const completedCourses = progress.filter((p) => p.progressPercentage === 100).length
  const totalLectures = progress.reduce((sum, p) => sum + p.totalLectures, 0)
  const completedLectures = progress.reduce((sum, p) => sum + p.completedLectures, 0)
  const averageProgress =
    progress.length > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.progressPercentage, 0) / progress.length)
      : 0

  return (
    <>
      <StudentHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              <DashboardStatCard
                title="Total Courses"
                value={totalCourses}
                detail={`${completedCourses} Completed`}
                gradient="blue"
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
              />
              <DashboardStatCard
                title="Lectures"
                value={totalLectures}
                detail={`${completedLectures} Completed`}
                gradient="purple"
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
              <DashboardStatCard
                title="Instructors"
                value={new Set(courses.map((c) => c.instructorId)).size}
                detail="Active courses"
                gradient="orange"
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <DashboardStatCard
                title="Progress"
                value={`${averageProgress}%`}
                detail={`${averageProgress > 50 ? "Increased" : "On Track"}`}
                gradient="green"
                icon={
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                }
              />
            </div>

            {/* Main Content Row - 3 Columns */}
            <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-3">
              {/* Left: Active Courses Table */}
              <div className="lg:col-span-2">
                {enrolledCourses.length > 0 ? (
                  <ActiveCoursesTable courses={enrolledCourses} progressMap={progressMap} />
                ) : (
                  <div className="rounded-lg border bg-card p-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-semibold">No enrolled courses yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Browse available courses and get enrolled by your administrator.
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Course Progress Card */}
              <div>
                {progress.length > 0 ? (
                  <CourseProgressCard progress={progress} />
                ) : (
                  <div className="rounded-lg border bg-card p-6 text-center">
                    <p className="text-sm text-muted-foreground">No progress data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Continue Learning Section */}
            {resumeData.length > 0 && !resumeLoading && (
              <div className="px-4 lg:px-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Continue Learning</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {resumeData.slice(0, 3).map((resume) => (
                    <ResumeCard key={resume.courseId} resumeData={resume} />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Row - 3 Columns */}
            <div className="grid gap-4 px-4 lg:px-6 lg:grid-cols-3">
              {/* Left: Instructors */}
              <div>
                <InstructorsSection courses={courses} />
              </div>

              {/* Middle: Help/Support */}
              <div>
                <HelpSupportCard />
              </div>

              {/* Right: Upcoming Deadlines */}
              <div>
                <UpcomingDeadlines />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
