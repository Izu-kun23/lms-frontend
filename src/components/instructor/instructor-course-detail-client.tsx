"use client"

import { useState, useEffect } from "react"
import { BookOpen, User, Plus, Edit, ArrowLeft, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { CourseWithModules } from "@/types/course"
import type { Module, Lecture } from "@/types/course"
import type { CourseProgress } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { CreateModuleModal } from "./create-module-modal"
import { CreateLectureModal } from "./create-lecture-modal"
import { CourseEnrolledStudents } from "./course-enrolled-students"
import { CourseProgressCard } from "@/components/shared/course-progress-card"
import Link from "next/link"
import Image from "next/image"

interface InstructorCourseDetailClientProps {
  course: CourseWithModules
  modules: Module[]
  progress?: CourseProgress
}

export function InstructorCourseDetailClient({
  course,
  modules: initialModules,
  progress,
}: InstructorCourseDetailClientProps) {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [moduleLectures, setModuleLectures] = useState<Record<string, Lecture[]>>({})
  const [loadingLectures, setLoadingLectures] = useState<Set<string>>(new Set())
  const [openModalModuleId, setOpenModalModuleId] = useState<string | null>(null)
  const [isCreateModuleModalOpen, setIsCreateModuleModalOpen] = useState(false)
  const [isCreateLectureModalOpen, setIsCreateLectureModalOpen] = useState(false)
  const [selectedModuleForLecture, setSelectedModuleForLecture] = useState<{ id: string; title: string } | null>(null)

  // Automatically fetch lectures for all modules on mount
  useEffect(() => {
    const fetchAllLectures = async () => {
      for (const module of modules) {
        setLoadingLectures((prev) => new Set(prev).add(module.id))
        try {
          const lectures = await apiClient.getModuleLectures(module.id)
          setModuleLectures((prev) => {
            // Only update if not already set to avoid unnecessary re-renders
            if (prev[module.id]) return prev
            return { ...prev, [module.id]: lectures }
          })
        } catch (error: any) {
          console.error(`Error fetching lectures for module ${module.id}:`, error)
          // Don't show toast for each module, just log the error
        } finally {
          setLoadingLectures((prev) => {
            const next = new Set(prev)
            next.delete(module.id)
            return next
          })
        }
      }
    }

    fetchAllLectures()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules])

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/instructor/courses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </Button>

      {/* Course Header */}
      <div className="space-y-4 pb-6 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground mt-2 text-lg">{course.code}</p>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 rounded-full">
            <Link href={`/instructor/courses/${course.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Course
            </Link>
          </Button>
        </div>

        {course.coverUrl && (
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md">
            <Image
              src={course.coverUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {course.summary && (
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {course.summary}
          </p>
        )}

        {course.instructor && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-5 w-5" />
            <span className="text-base">
              Instructor: {course.instructor.firstName}{" "}
              {course.instructor.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Course Progress (if instructor is also enrolled) */}
      {progress && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="lg:col-span-1">
            <CourseProgressCard
              progress={progress}
              courseId={course.id}
              showContinueButton={false}
            />
          </div>
        </div>
      )}

      {/* Modules Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Course Modules</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {modules.length} {modules.length === 1 ? "module" : "modules"}
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateModuleModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>

        {modules.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg mb-4">No modules yet</p>
            <Button 
              onClick={() => setIsCreateModuleModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Module
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white block max-w-sm p-6 border border-border rounded-lg flex flex-col min-h-[280px]"
              >
                <div className="flex items-start gap-2 mb-3">
                  <BookOpen className="w-7 h-7 mb-3 text-muted-foreground flex-shrink-0" />
                </div>
                
                <h5 className="mb-2 text-lg font-semibold tracking-tight text-foreground line-clamp-2">
                  {module.title}
                </h5>
                
                {module.description && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                    {module.description}
                  </p>
                )}
                
                <div className="mt-2 flex-1">
                  {loadingLectures.has(module.id) ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-xs text-muted-foreground">
                        Loading lectures...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 mb-3">
                        {moduleLectures[module.id]?.length > 0 ? (
                          <>
                            <div className="flex flex-col gap-2">
                              {moduleLectures[module.id].slice(0, 4).map((lecture, index) => (
                                <Link
                                  key={lecture.id}
                                  href={`/instructor/courses/${course.id}/modules/${module.id}/lectures/${lecture.id}`}
                                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors group"
                                >
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-semibold">
                                    {index + 1}
                                  </span>
                                  <span className="flex-1 font-medium text-orange-600 dark:text-orange-400 group-hover:underline text-sm truncate">
                                    {lecture.title}
                                  </span>
                                  <svg
                                    className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                </Link>
                              ))}
                            </div>
                            {moduleLectures[module.id].length > 4 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="mt-2 w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-sm"
                              >
                                <Link href={`/instructor/courses/${course.id}/modules/${module.id}/lectures`}>
                                  View more ({moduleLectures[module.id].length - 4} more)
                                </Link>
                              </Button>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground py-2">
                            No lectures in this module
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedModuleForLecture({ id: module.id, title: module.title })
                          setIsCreateLectureModalOpen(true)
                        }}
                        className="inline-flex font-medium items-center text-orange-600 hover:underline text-sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lecture
                        <svg
                          className="w-4 h-4 ms-2 rtl:rotate-[270deg]"
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
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrolled Students Section */}
      <div className="space-y-6">
        <CourseEnrolledStudents courseId={course.id} />
      </div>

      {/* Lectures Modal */}
      {openModalModuleId && moduleLectures[openModalModuleId] && (
        <Sheet open={!!openModalModuleId} onOpenChange={(open) => !open && setOpenModalModuleId(null)}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>
                {modules.find((m) => m.id === openModalModuleId)?.title || "Lectures"}
              </SheetTitle>
              <SheetDescription>
                {moduleLectures[openModalModuleId]?.length || 0} lecture
                {moduleLectures[openModalModuleId]?.length !== 1 ? "s" : ""} in this module
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {moduleLectures[openModalModuleId].map((lecture, index) => (
                <Link
                  key={lecture.id}
                  href={`/instructor/courses/${course.id}/modules/${modules.find((m) => m.id === openModalModuleId)?.id}/lectures/${lecture.id}`}
                  className="block p-4 border border-border rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 dark:hover:border-orange-800 transition-all duration-200"
                  onClick={() => setOpenModalModuleId(null)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground mb-1">{lecture.title}</h4>
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
                    </div>
                    <svg
                      className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1"
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
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Create Module Modal */}
      <CreateModuleModal
        courseId={course.id}
        open={isCreateModuleModalOpen}
        onOpenChange={setIsCreateModuleModalOpen}
        onModuleCreated={(newModule) => {
          setModules((prev) => [...prev, newModule])
          // Fetch lectures for the new module
          setLoadingLectures((prev) => new Set(prev).add(newModule.id))
          apiClient.getModuleLectures(newModule.id)
            .then((lectures) => {
              setModuleLectures((prev) => ({ ...prev, [newModule.id]: lectures }))
            })
            .catch((error) => {
              console.error(`Error fetching lectures for module ${newModule.id}:`, error)
            })
            .finally(() => {
              setLoadingLectures((prev) => {
                const next = new Set(prev)
                next.delete(newModule.id)
                return next
              })
            })
        }}
        existingModulesCount={modules.length}
      />

      {/* Create Lecture Modal */}
      {selectedModuleForLecture && (
        <CreateLectureModal
          moduleId={selectedModuleForLecture.id}
          moduleTitle={selectedModuleForLecture.title}
          open={isCreateLectureModalOpen}
          onOpenChange={(open) => {
            setIsCreateLectureModalOpen(open)
            if (!open) {
              setSelectedModuleForLecture(null)
            }
          }}
          onLectureCreated={(newLecture) => {
            // Update the lectures for the module
            setModuleLectures((prev) => ({
              ...prev,
              [selectedModuleForLecture.id]: [
                ...(prev[selectedModuleForLecture.id] || []),
                newLecture,
              ],
            }))
          }}
          existingLecturesCount={moduleLectures[selectedModuleForLecture.id]?.length || 0}
        />
      )}
    </div>
  )
}

