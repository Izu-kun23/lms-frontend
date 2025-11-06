"use client"

import React from "react"
import { Course, CourseProgress } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface CourseCardProps {
  course: Course
  progress?: CourseProgress
  showProgress?: boolean
}

export function CourseCard({ course, progress, showProgress = false }: CourseCardProps) {
  const router = useRouter()

  const handleViewCourse = () => {
    router.push(`/courses/${course.id}`)
  }

  const progressPercentage = progress?.progressPercentage || 0

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 dark:bg-gray-800">
      {course.coverUrl ? (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={course.coverUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          {showProgress && progressPercentage > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-900/20">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
          {course.code && (
            <div className="absolute top-4 left-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
              {course.code}
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex h-48 items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
          <div className="text-center">
            <div className="text-5xl font-bold text-white">{course.code}</div>
            <div className="mt-2 text-xs font-medium text-white/80">Course</div>
          </div>
          {course.code && (
            <div className="absolute top-4 left-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm">
              {course.code}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 dark:text-white">
            {course.title}
          </h3>
          {course.instructor && (
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {course.instructor.firstName} {course.instructor.lastName}
            </p>
          )}
        </div>

        {course.summary && (
          <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {course.summary}
          </p>
        )}

        {showProgress && progress && (
          <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="font-bold text-gray-900 dark:text-white">{progressPercentage}%</span>
            </div>
            <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {progress.completedLectures} of {progress.totalLectures} lectures completed
            </p>
          </div>
        )}

        <button
          onClick={handleViewCourse}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            progressPercentage > 0
              ? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02]"
              : "border-2 border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400"
          }`}
        >
          {progressPercentage > 0 ? "Continue Learning →" : "View Course"}
        </button>
      </div>
    </div>
  )
}

