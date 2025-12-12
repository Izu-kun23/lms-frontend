"use client"

import { ProgressBar } from "@/components/shared/progress-bar"
import { ProgressChart } from "@/components/shared/progress-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OverallProgress } from "@/types/progress"

interface ProgressDashboardClientProps {
  progress: OverallProgress
}

export function ProgressDashboardClient({
  progress,
}: ProgressDashboardClientProps) {
  const courses = progress?.courses || []
  const chartData = courses.map((course) => ({
    name: course.courseTitle,
    value: course.progressPercentage,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {Math.round(progress?.overallProgressPercentage || 0)}%
            </div>
            <ProgressBar value={progress?.overallProgressPercentage || 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courses Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {progress?.completedCourses || 0} / {progress?.enrolledCourses || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {progress?.inProgressCourses || 0} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((progress?.totalTimeSpent || 0) / 3600)}h
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total learning time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressChart data={chartData} type="bar" />
        </CardContent>
      </Card>

      {/* Course Progress List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Course Details</h2>
        {courses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No course progress data available</p>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
          <Card key={course.courseId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{course.courseTitle}</h3>
                  {course.courseCode && (
                    <p className="text-sm text-muted-foreground">
                      {course.courseCode}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {Math.round(course.progressPercentage)}%
                  </div>
                </div>
              </div>
              <ProgressBar value={course.progressPercentage} />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>
                  {course.completedLectures} / {course.totalLectures} lectures
                </span>
                {course.lastAccessedAt && (
                  <span>
                    Last accessed:{" "}
                    {new Date(course.lastAccessedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}

