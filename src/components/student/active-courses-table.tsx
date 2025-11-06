"use client"

import React from "react"
import Link from "next/link"
import { Course, CourseProgress } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActiveCoursesTableProps {
  courses: Course[]
  progressMap: Map<string, CourseProgress>
}

export function ActiveCoursesTable({ courses, progressMap }: ActiveCoursesTableProps) {
  const getStatus = (progress?: CourseProgress) => {
    if (!progress) return { label: "Not Started", color: "bg-gray-500" }
    if (progress.progressPercentage === 100) return { label: "Completed", color: "bg-green-500" }
    if (progress.progressPercentage >= 70) return { label: "On Track", color: "bg-blue-600" }
    if (progress.progressPercentage >= 40) return { label: "At Risk", color: "bg-blue-400" }
    return { label: "Delayed", color: "bg-blue-300" }
  }

  const getProgressColor = (progress?: CourseProgress) => {
    if (!progress) return "bg-gray-200"
    if (progress.progressPercentage === 100) return "bg-green-500"
    if (progress.progressPercentage >= 70) return "bg-blue-600"
    if (progress.progressPercentage >= 40) return "bg-blue-400"
    return "bg-blue-300"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Instructor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.slice(0, 5).map((course) => {
                const courseProgress = progressMap.get(course.id)
                const status = getStatus(courseProgress)
                const progressPercentage = courseProgress?.progressPercentage || 0

                return (
                  <tr key={course.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{course.title}</div>
                        {course.code && (
                          <div className="text-xs text-muted-foreground">{course.code}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all", getProgressColor(courseProgress))}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn("border-0 text-white", status.color)}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {course.instructor ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                            {course.instructor.firstName.charAt(0)}
                            {course.instructor.lastName.charAt(0)}
                          </div>
                          <span className="text-sm">
                            {course.instructor.firstName} {course.instructor.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/courses/${course.id}`}>
                          {progressPercentage > 0 ? "Continue" : "View"}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {courses.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="link" asChild>
              <Link href="/student/courses">View All Courses</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

