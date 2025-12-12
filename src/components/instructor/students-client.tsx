"use client"

import { Users, Mail, GraduationCap, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { User } from "@/lib/types"

interface StudentWithEnrollments {
  id: string
  userId: string
  user: User
  enrollments?: any[]
  enrollment?: any
  enrollmentStatus?: string
  enrolledAt?: string
}

interface StudentsClientProps {
  students: StudentWithEnrollments[]
}

export function StudentsClient({ students }: StudentsClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          View and manage students enrolled in your courses
        </p>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No students found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Students will appear here once they enroll in your courses
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => {
            const user = student.user
            const enrollmentCount = student.enrollments?.length || (student.enrollment ? 1 : 0)
            
            return (
              <Card key={student.id || student.userId}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user?.email}</span>
                      </div>
                      {user?.studentId && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          <span>ID: {user.studentId}</span>
                        </div>
                      )}
                      {user?.matricNumber && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          <span>Matric: {user.matricNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    {enrollmentCount > 0 && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {enrollmentCount} {enrollmentCount === 1 ? "course" : "courses"}
                        </span>
                      </div>
                    )}
                    
                    {student.enrollmentStatus && (
                      <Badge variant={student.enrollmentStatus === "ACTIVE" ? "default" : "secondary"}>
                        {student.enrollmentStatus}
                      </Badge>
                    )}
                    
                    <div className="pt-2">
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href={`/instructor/students/${student.userId || student.id}`}>
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
    </div>
  )
}

