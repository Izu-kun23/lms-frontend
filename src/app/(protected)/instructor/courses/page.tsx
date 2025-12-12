import { Suspense } from "react"
import { getInstructorCourses } from "@/lib/server/instructor-api"
import { apiGet } from "@/lib/server/api-client"
import type { User, Course } from "@/lib/types"
import { CoursesManagementClient } from "@/components/instructor/courses-management-client"
import { Skeleton } from "@/components/ui/skeleton"

function CoursesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-10 w-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  )
}

export default async function InstructorCoursesPage() {
  // Get current user to filter courses by instructor ID
  const currentUser = await apiGet<User>("/users/me", {
    requireAuth: true,
  }).catch(() => null)

  // Fetch courses filtered by instructor ID
  const courses = await getInstructorCourses(currentUser?.id)

  const coursesWithInstructor = await Promise.all(
    courses.map(async (course: Course) => {
      // If course already has instructor info, return as is
      if (course.instructor) {
        return course
      }

      // If current user is the instructor, use their info as fallback
      if (currentUser && course.instructorId === currentUser.id) {
        return {
          ...course,
          instructor: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
          },
        }
      }

      // Last resort: try to fetch instructor info if instructorId exists
      if (course.instructorId) {
        try {
          const instructor = await apiGet<User>(`/users/${course.instructorId}`, {
            requireAuth: true,
          })
          return {
            ...course,
            instructor: {
              id: instructor.id,
              firstName: instructor.firstName,
              lastName: instructor.lastName,
            },
          }
        } catch (error) {
          console.warn(
            `Instructor data not available for course ${course.id}. API should include instructor data by default.`
          )
          return course
        }
      }

      return course
    })
  )

  return (
    <Suspense fallback={<CoursesSkeleton />}>
      <CoursesManagementClient courses={coursesWithInstructor} />
    </Suspense>
  )
}

