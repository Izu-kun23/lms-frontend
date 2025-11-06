"use client"

import React from "react"
import { ResumeData } from "@/lib/types"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ResumeCardProps {
  resumeData: ResumeData
}

export function ResumeCard({ resumeData }: ResumeCardProps) {
  const router = useRouter()

  const handleResume = () => {
    if (resumeData.lectureId) {
      router.push(`/courses/${resumeData.courseId}/lecture/${resumeData.lectureId}`)
    } else {
      router.push(`/courses/${resumeData.courseId}`)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl bg-linear-to-br from-blue-50 to-white p-6 shadow-sm transition-all duration-300 dark:from-gray-800 dark:to-gray-900">
      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Continue Learning
            </div>
            <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              {resumeData.courseTitle}
            </h3>
            {resumeData.courseCode && (
              <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                {resumeData.courseCode}
              </p>
            )}
          </div>
          <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {resumeData.lectureTitle && (
          <div className="mb-4 rounded-lg bg-white/60 p-3 backdrop-blur-sm dark:bg-gray-800/60">
            <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Last accessed:</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {resumeData.moduleTitle && `${resumeData.moduleTitle} - `}
              {resumeData.lectureTitle}
            </p>
          </div>
        )}

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {Math.round(resumeData.progressPercentage)}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${resumeData.progressPercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleResume}
          className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-600 hover:scale-[1.02]"
        >
          Continue Course →
        </button>
      </div>
      {/* Decorative gradient */}
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl transition-opacity group-hover:opacity-30" />
    </div>
  )
}

