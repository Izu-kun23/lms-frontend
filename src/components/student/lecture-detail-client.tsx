"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentRenderer } from "@/components/shared/content-renderer"
import type { Lecture, Content } from "@/types/course"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface LectureDetailClientProps {
  courseId: string
  lecture: Lecture
  contents: Content[]
}

export function LectureDetailClient({
  courseId,
  lecture,
  contents,
}: LectureDetailClientProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      // Try to get existing progress first to merge with update
      let existingProgress = null
      try {
        existingProgress = await apiClient.getLectureProgress(lecture.id)
      } catch (error) {
        // If no progress exists yet, that's okay - we'll create new progress
      }

      // Build update payload
      const updatePayload: {
        completed: boolean
        lastPosition?: number
        lastContentId?: string
        timeSpent?: number
      } = {
        completed: true,
      }

      // Include existing progress data if available (to preserve state)
      if (existingProgress) {
        if (existingProgress.lastPosition !== undefined && existingProgress.lastPosition > 0) {
          updatePayload.lastPosition = existingProgress.lastPosition
        }
        if (existingProgress.lastContentId) {
          updatePayload.lastContentId = existingProgress.lastContentId
        }
        if (existingProgress.timeSpent !== undefined && existingProgress.timeSpent > 0) {
          updatePayload.timeSpent = existingProgress.timeSpent
        }
      }

      await apiClient.updateLectureProgress(lecture.id, updatePayload)
    } catch (error: any) {
      console.error("Failed to update lecture progress:", error)
      console.error("Error details:", error.response?.data || error.message)
      // You might want to show a toast notification here
    } finally {
      setIsCompleting(false)
    }
  }

  // Sort contents by order
  const sortedContents = [...contents].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/student/courses/${courseId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Link>
      </Button>

      {/* Lecture Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex items-start gap-3">
          <BookOpen className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{lecture.title}</h1>
            {lecture.description && (
              <p className="text-muted-foreground mt-2 text-lg">
                {lecture.description}
              </p>
            )}
            {lecture.type && (
              <span className="inline-block mt-3 px-3 py-1 text-sm font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                {lecture.type}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lecture Contents */}
      {sortedContents.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-lg">
            No content available for this lecture
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedContents.map((content, index) => (
            <div key={content.id} className="space-y-2">
              {sortedContents.length > 1 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Content {index + 1}</span>
                  <span>•</span>
                  <span className="uppercase">{content.type}</span>
                </div>
              )}
              <ContentRenderer content={content} />
            </div>
          ))}
        </div>
      )}

      {/* Complete Button */}
      <div className="pt-6 border-t">
        <Button
          onClick={handleComplete}
          disabled={isCompleting}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isCompleting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Marking as complete...
            </>
          ) : (
            "Mark as Complete"
          )}
        </Button>
      </div>
    </div>
  )
}

