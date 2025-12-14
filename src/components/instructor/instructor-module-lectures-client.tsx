"use client"

import { useState } from "react"
import { BookOpen, ArrowLeft, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CourseWithModules } from "@/types/course"
import type { Module, Lecture } from "@/types/course"
import { apiClient } from "@/lib/api"
import { CreateLectureModal } from "./create-lecture-modal"
import Link from "next/link"
import { toast } from "sonner"

interface InstructorModuleLecturesClientProps {
  course: CourseWithModules
  module: Module
  lectures: Lecture[]
}

export function InstructorModuleLecturesClient({
  course,
  module,
  lectures: initialLectures,
}: InstructorModuleLecturesClientProps) {
  const [lectures, setLectures] = useState<Lecture[]>(initialLectures)
  const [isCreateLectureModalOpen, setIsCreateLectureModalOpen] = useState(false)

  const handleLectureCreated = async (newLecture: Lecture) => {
    setLectures((prev) => [...prev, newLecture])
    toast.success("Lecture created successfully!")
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/instructor/courses/${course.id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Link>
      </Button>

      {/* Module Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-6 w-6 text-orange-600" />
              <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
            </div>
            {module.description && (
              <p className="text-muted-foreground mt-2 text-base">{module.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Course: <span className="font-medium">{course.title}</span>
            </p>
          </div>
          <Button
            onClick={() => setIsCreateLectureModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lecture
          </Button>
        </div>
      </div>

      {/* Lectures List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Lectures</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
            </p>
          </div>
        </div>

        {lectures.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-4">No lectures yet</p>
            <Button
              onClick={() => setIsCreateLectureModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Lecture
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {lectures.map((lecture, index) => (
              <Link
                key={lecture.id}
                href={`/instructor/courses/${course.id}/modules/${module.id}/lectures/${lecture.id}`}
                className="block"
              >
                <Card className="p-4 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{lecture.title}</h3>
                      {lecture.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lecture.description}
                        </p>
                      )}
                      {lecture.type && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded">
                          {lecture.type}
                        </span>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                      />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Lecture Modal */}
      <CreateLectureModal
        moduleId={module.id}
        moduleTitle={module.title}
        open={isCreateLectureModalOpen}
        onOpenChange={setIsCreateLectureModalOpen}
        onLectureCreated={handleLectureCreated}
        existingLecturesCount={lectures.length}
      />
    </div>
  )
}

