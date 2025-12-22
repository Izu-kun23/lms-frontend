"use client"

import { Users, Mail, GraduationCap, BookOpen, Calendar, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { User, Course } from "@/lib/types"

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

interface CourseWithStudents {
  course: Course
  students: EnrolledStudent[]
}

interface StudentsClientProps {
  coursesWithStudents: CourseWithStudents[]
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
})

export function StudentsClient({ coursesWithStudents }: StudentsClientProps) {
  const totalStudents = coursesWithStudents.reduce(
    (sum, courseData) => sum + courseData.students.length,
    0
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          View students enrolled in your courses
        </p>
        {totalStudents > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {totalStudents} {totalStudents === 1 ? "student" : "students"} across{" "}
            {coursesWithStudents.length} {coursesWithStudents.length === 1 ? "course" : "courses"}
          </p>
        )}
      </div>

      {coursesWithStudents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No courses found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Students will appear here once they enroll in your courses
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {coursesWithStudents.map(({ course, students }) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {course.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {course.code} • {students.length}{" "}
                      {students.length === 1 ? "student enrolled" : "students enrolled"}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/instructor/courses/${course.id}`}>
                      View Course
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => {
                      const fullName = `${student.firstName} ${student.lastName}`.trim()
                      const enrolledDate = student.enrolledAt
                        ? DATE_FORMATTER.format(new Date(student.enrolledAt))
                        : "—"

                      return (
                        <Card key={student.enrollmentId} className="border">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-base">{fullName}</h3>
                                <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                                  <Mail className="h-3.5 w-3.5" />
                                  <span className="truncate">{student.email}</span>
                                </div>
                                {student.studentIdNumber && (
                                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <Hash className="h-3.5 w-3.5" />
                                    <span>ID: {student.studentIdNumber}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>Enrolled {enrolledDate}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t">
                                <Badge
                                  variant={
                                    student.enrollmentStatus === "ACTIVE"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {student.enrollmentStatus}
                                </Badge>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/instructor/students/${student.studentId}`}>
                                    View Progress
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

