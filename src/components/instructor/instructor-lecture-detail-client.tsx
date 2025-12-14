"use client"

import { useState } from "react"
import { FileText, Video, Music, File, Radio, ArrowLeft, Plus, Loader2, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CourseWithModules } from "@/types/course"
import type { Module, Lecture, Content } from "@/types/course"
import { apiClient } from "@/lib/api"
import { CreateContentModal } from "./create-content-modal"
import { EditContentModal } from "./edit-content-modal"
import Link from "next/link"
import { toast } from "sonner"

interface InstructorLectureDetailClientProps {
  course: CourseWithModules
  module: Module
  lecture: Lecture
  contents: Content[]
}

const contentTypeIcons = {
  TEXT: FileText,
  VIDEO: Video,
  AUDIO: Music,
  FILE: File,
  LIVE: Radio,
}

const contentTypeColors = {
  TEXT: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  VIDEO: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  AUDIO: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  FILE: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  LIVE: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
}

export function InstructorLectureDetailClient({
  course,
  module,
  lecture,
  contents: initialContents,
}: InstructorLectureDetailClientProps) {
  const [contents, setContents] = useState<Content[]>(initialContents)
  const [isCreateContentModalOpen, setIsCreateContentModalOpen] = useState(false)
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  const handleContentCreated = async (newContent: Content) => {
    setContents((prev) => [...prev, newContent])
    toast.success("Content created successfully!")
  }

  const handleContentUpdated = async (updatedContent: Content) => {
    setContents((prev) => prev.map((c) => (c.id === updatedContent.id ? updatedContent : c)))
    toast.success("Content updated successfully!")
  }

  const handleEditContent = (content: Content) => {
    setSelectedContent(content)
    setIsEditContentModalOpen(true)
  }

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm("Are you sure you want to delete this content?")) {
      return
    }

    try {
      await apiClient.deleteLectureContent(contentId)
      setContents((prev) => prev.filter((c) => c.id !== contentId))
      toast.success("Content deleted successfully!")
    } catch (error: any) {
      console.error("Failed to delete content:", error)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete content. Please try again."
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/instructor/courses/${course.id}/modules/${module.id}/lectures`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lectures
        </Link>
      </Button>

      {/* Lecture Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-6 w-6 text-orange-600" />
              <h1 className="text-3xl font-bold tracking-tight">{lecture.title}</h1>
            </div>
            {lecture.description && (
              <p className="text-muted-foreground mt-2 text-base">{lecture.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span>
                Course: <span className="font-medium">{course.title}</span>
              </span>
              <span>•</span>
              <span>
                Module: <span className="font-medium">{module.title}</span>
              </span>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateContentModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Contents List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Lecture Content</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {contents.length} {contents.length === 1 ? "content item" : "content items"}
            </p>
          </div>
        </div>

        {contents.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-4">No content yet</p>
            <Button
              onClick={() => setIsCreateContentModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Content
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {contents
              .sort((a, b) => a.order - b.order)
              .map((content, index) => {
                const Icon = contentTypeIcons[content.type] || FileText
                const colorClass = contentTypeColors[content.type] || contentTypeColors.TEXT

                return (
                  <Card key={content.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="font-semibold text-foreground capitalize">
                                {content.type.toLowerCase()} Content
                              </h3>
                              {content.type === "TEXT" && content.text && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                                  {content.text}
                                </p>
                              )}
                              {content.mediaUrl && (
                                <a
                                  href={content.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-orange-600 dark:text-orange-400 hover:underline mt-1 inline-block"
                                >
                                  {content.mediaUrl}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContent(content)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContent(content.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {content.metadata && Object.keys(content.metadata).length > 0 && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Metadata:</p>
                            <pre className="text-xs text-foreground overflow-x-auto">
                              {JSON.stringify(content.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
          </div>
        )}
      </div>

      {/* Create Content Modal */}
      <CreateContentModal
        lectureId={lecture.id}
        lectureTitle={lecture.title}
        open={isCreateContentModalOpen}
        onOpenChange={setIsCreateContentModalOpen}
        onContentCreated={handleContentCreated}
        existingContentsCount={contents.length}
      />

      {/* Edit Content Modal */}
      {selectedContent && (
        <EditContentModal
          content={selectedContent}
          open={isEditContentModalOpen}
          onOpenChange={(open) => {
            setIsEditContentModalOpen(open)
            if (!open) {
              setSelectedContent(null)
            }
          }}
          onContentUpdated={handleContentUpdated}
        />
      )}
    </div>
  )
}

