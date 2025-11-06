"use client"

import React from "react"
import { Course } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InstructorsSectionProps {
  courses: Course[]
}

export function InstructorsSection({ courses }: InstructorsSectionProps) {
  // Extract unique instructors
  const instructorsMap = new Map<string, { instructor: Course["instructor"], courseCount: number }>()
  
  courses.forEach((course) => {
    if (course.instructor) {
      const key = course.instructor.id
      const existing = instructorsMap.get(key)
      if (existing) {
        existing.courseCount++
      } else {
        instructorsMap.set(key, {
          instructor: course.instructor,
          courseCount: 1,
        })
      }
    }
  })

  const instructors = Array.from(instructorsMap.values()).slice(0, 3)

  if (instructors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Instructors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No instructors available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {instructors.map((item, index) => {
            if (!item.instructor) return null
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {item.instructor.firstName.charAt(0)}
                  {item.instructor.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {item.instructor.firstName} {item.instructor.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Course Instructor
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Courses: {item.courseCount} {item.courseCount === 1 ? "course" : "courses"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


