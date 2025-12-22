import { Suspense } from "react"
import { getInstructorCourses, getCourseStudents } from "@/lib/server/instructor-api"
import { apiGet } from "@/lib/server/api-client"
import type { User } from "@/lib/types"
import { StudentsClient } from "@/components/instructor/students-client"
import { Skeleton } from "@/components/ui/skeleton"

function StudentsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  )
}

export default async function InstructorStudentsPage() {
  // Get current user to determine instructor
  const user = await apiGet<User>("/users/me", { requireAuth: true }).catch(() => null)
  const isAdmin = user?.role?.toUpperCase() === "ADMIN" || user?.role?.toUpperCase() === "SUPER_ADMIN"

  // Get all courses the instructor teaches
  const courses = await getInstructorCourses(
    isAdmin ? undefined : user?.id,
    user?.role
  ).catch(() => [])

  // Fetch enrolled students for each course
  const coursesWithStudents = await Promise.all(
    courses.map(async (course) => {
      try {
        const students = await getCourseStudents(course.id)
        return {
          course,
          students: students.map((student) => ({
            enrollmentId: student.enrollmentId || student.id,
            studentId: student.studentId || student.userId || student.id,
            firstName: student.user?.firstName || "",
            lastName: student.user?.lastName || "",
            email: student.user?.email || "",
            studentIdNumber: student.studentIdNumber,
            enrollmentStatus: student.enrollmentStatus || "ACTIVE",
            enrolledAt: student.enrolledAt || "",
          })),
        }
      } catch (error) {
        console.error(`Failed to fetch students for course ${course.id}:`, error)
        return {
          course,
          students: [],
        }
      }
    })
  )

  // Filter out courses with no students (optional - you can remove this if you want to show all courses)
  // const coursesWithStudentsFiltered = coursesWithStudents.filter(
  //   (item) => item.students.length > 0
  // )

  return (
    <Suspense fallback={<StudentsSkeleton />}>
      <StudentsClient coursesWithStudents={coursesWithStudents} />
    </Suspense>
  )
}

