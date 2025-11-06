"use client"

import React from "react"
import { CourseProgress } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CourseProgressCardProps {
  progress: CourseProgress[]
}

export function CourseProgressCard({ progress }: CourseProgressCardProps) {
  const completed = progress.filter((p) => p.progressPercentage === 100).length
  const inProgress = progress.filter((p) => p.progressPercentage > 0 && p.progressPercentage < 100).length
  const upcoming = progress.filter((p) => p.progressPercentage === 0).length
  const total = progress.length

  const overallProgress = total > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.progressPercentage, 0) / total)
    : 0

  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0
  const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0
  const upcomingPercent = total > 0 ? Math.round((upcoming / total) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-2xl font-bold">{overallProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="flex h-full">
                <div
                  className="bg-blue-600"
                  style={{ width: `${completedPercent}%` }}
                />
                <div
                  className="bg-blue-400"
                  style={{ width: `${inProgressPercent}%` }}
                />
                <div
                  className="bg-blue-100 dark:bg-blue-900/30"
                  style={{ width: `${upcomingPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-2xl font-bold">{completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-2xl font-bold">{inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>

            <div className="flex flex-col items-center rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold">{upcoming}</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


