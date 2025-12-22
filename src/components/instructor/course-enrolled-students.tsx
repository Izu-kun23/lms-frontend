"use client"

import { useState, useEffect } from "react"
import { Users, Loader2, Mail, Calendar, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"

interface EnrolledStudent {
  enrollmentId: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  studentIdNumber?: number
  enrollmentStatus: string
  enrolledAt: string
}

interface CourseEnrolledStudentsProps {
  courseId: string
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
})

export function CourseEnrolledStudents({ courseId }: CourseEnrolledStudentsProps) {
  const [students, setStudents] = useState<EnrolledStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const enrolledStudents = await apiClient.getCourseEnrolledStudents(courseId)
        setStudents(enrolledStudents)
      } catch (err: any) {
        console.error("Failed to fetch enrolled students:", err)
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load enrolled students"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [courseId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enrolled Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading students...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enrolled Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Enrolled Students
        </CardTitle>
        <CardDescription>
          {students.length} {students.length === 1 ? "student" : "students"} enrolled in this course
        </CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No students enrolled yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => {
              const enrolledDate = student.enrolledAt
                ? DATE_FORMATTER.format(new Date(student.enrolledAt))
                : "—"
              const fullName = `${student.firstName} ${student.lastName}`.trim() || "Unknown"

              return (
                <div
                  key={student.enrollmentId}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground truncate">
                        {fullName}
                      </h4>
                      <Badge
                        variant={
                          student.enrollmentStatus === "ACTIVE"
                            ? "default"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        {student.enrollmentStatus}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      {student.studentIdNumber && (
                        <div className="flex items-center gap-1.5">
                          <Hash className="h-3.5 w-3.5" />
                          <span>ID: {student.studentIdNumber}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Enrolled {enrolledDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
