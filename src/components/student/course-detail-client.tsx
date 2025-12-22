"use client"

import { useState, useEffect } from "react"
import { BookOpen, User, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
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
import Link from "next/link"

interface CourseDetailClientProps {
  course: CourseWithModules
  modules: Module[]
  progress?: CourseProgress
}

export function CourseDetailClient({
  course,
  modules,
  progress,
}: CourseDetailClientProps) {
  const [moduleLectures, setModuleLectures] = useState<Record<string, Lecture[]>>({})
  const [loadingLectures, setLoadingLectures] = useState<Set<string>>(new Set())
  const [openModalModuleId, setOpenModalModuleId] = useState<string | null>(null)

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
      {/* Course Header */}
      <div className="space-y-4 pb-6 border-b">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{course.code}</p>
        </div>
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

      {/* Modules */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">Course Content</h2>
          <p className="text-sm text-muted-foreground">
            {modules.length} {modules.length === 1 ? "module" : "modules"}
          </p>
        </div>
        
        {modules.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No modules available yet</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white max-w-sm p-6 border border-border rounded-lg flex flex-col min-h-[280px]"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-3">
                    <BookOpen className="w-7 h-7 mb-3 text-muted-foreground shrink-0" />
                  </div>
                  
                  <h5 className="mb-2 text-lg font-semibold tracking-tight text-foreground line-clamp-2">
                    {module.title}
                  </h5>
                  
                  {module.description && (
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                      {module.description}
                    </p>
                  )}
                </div>
                
                <div className="mt-auto pt-4 border-t">
                  {loadingLectures.has(module.id) ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-xs text-muted-foreground">
                        Loading lectures...
                      </span>
                    </div>
                  ) : moduleLectures[module.id]?.length > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenModalModuleId(module.id)}
                      className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-sm"
                    >
                      View more ({moduleLectures[module.id].length} lecture{moduleLectures[module.id].length !== 1 ? "s" : ""})
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No lectures available in this module
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
                  href={`/student/courses/${course.id}/lectures/${lecture.id}`}
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
    </div>
  )
}

