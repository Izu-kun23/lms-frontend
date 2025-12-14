import { apiGet, apiPost, apiPut, apiDelete } from "./api-client"
import type { Course } from "@/lib/types"
import type {
  CourseWithModules,
  Module,
  Lecture,
  Content,
  CreateModuleInput,
  UpdateModuleInput,
  CreateLectureInput,
  UpdateLectureInput,
  CreateContentInput,
  UpdateContentInput,
} from "@/types/course"
import type { User } from "@/lib/types"
import type {
  AssignmentWithCourse,
  SubmissionWithDetails,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  GradeSubmissionInput,
} from "@/types/assignment"
import type {
  Quiz,
  CreateQuizInput,
  UpdateQuizInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  CreateOptionInput,
  UpdateOptionInput,
  QuizAttempt,
} from "@/types/quiz"
import type {
  CourseAnalytics,
  StudentStatistics,
  QuizStatistics,
  InstructorDashboardStats,
} from "@/types/analytics"

// Dashboard
export async function fetchInstructorDashboard(instructorId?: string, userRole?: string) {
  const params = new URLSearchParams()
  params.append("include", "instructor")
  // Only filter by instructorId if provided and user is not an admin
  // Admins should see all courses, not just courses assigned to them
  if (instructorId && userRole?.toUpperCase() !== "ADMIN" && userRole?.toUpperCase() !== "SUPER_ADMIN") {
    params.append("instructorId", instructorId)
  }
  
  const [courses, stats, submissions] = await Promise.all([
    apiGet<Course[]>(`/courses?${params.toString()}`, { requireAuth: true }),
    apiGet<InstructorDashboardStats>("/courses/stats", {
      requireAuth: true,
    }).catch(() => null),
    apiGet<SubmissionWithDetails[]>("/assignments/pending-grading", {
      requireAuth: true,
    }).catch(() => [] as SubmissionWithDetails[]),
  ])

  return {
    courses,
    stats,
    pendingSubmissions: submissions,
  }
}

export async function getRecentEnrollments() {
  return apiGet<any[]>("/enrollments/recent", { requireAuth: true }).catch(
    () => []
  )
}

// Courses
export async function getInstructorCourses(instructorId?: string, userRole?: string) {
  const params = new URLSearchParams()
  params.append("include", "instructor")
  // Only filter by instructorId if provided and user is not an admin
  // Admins should see all courses, not just courses assigned to them
  if (instructorId && userRole?.toUpperCase() !== "ADMIN" && userRole?.toUpperCase() !== "SUPER_ADMIN") {
    params.append("instructorId", instructorId)
  }
  return apiGet<Course[]>(`/courses?${params.toString()}`, { requireAuth: true })
}

export async function getCourseDetails(courseId: string) {
  return apiGet<CourseWithModules>(`/courses/${courseId}?include=instructor`, {
    requireAuth: true,
  })
}

export async function createCourse(data: {
  title: string
  code: string
  summary: string
  coverUrl?: string
  schoolId: string
}) {
  return apiPost<Course>("/courses", data, { requireAuth: true })
}

export async function updateCourse(
  courseId: string,
  data: {
    title?: string
    code?: string
    summary?: string
    coverUrl?: string
  }
) {
  return apiPut<Course>(`/courses/${courseId}`, data, { requireAuth: true })
}

export async function deleteCourse(courseId: string) {
  return apiDelete<void>(`/courses/${courseId}`, { requireAuth: true })
}

export async function getCourseStats() {
  return apiGet<InstructorDashboardStats>("/courses/stats", {
    requireAuth: true,
  })
}

// Modules
export async function getCourseModules(courseId: string) {
  const response = await apiGet<Array<{
    id: string
    title: string
    index: number
    courseId: string
    description?: string
    createdAt?: string
    updatedAt?: string
  }>>(`/courses/${courseId}/modules`, {
    requireAuth: true,
  })
  // Map API response (with 'index') to Module type (with 'order')
  return response.map((module) => ({
    id: module.id,
    title: module.title,
    courseId: module.courseId,
    order: module.index,
    description: module.description,
    createdAt: module.createdAt || new Date().toISOString(),
    updatedAt: module.updatedAt || new Date().toISOString(),
  })) as Module[]
}

export async function createModule(
  courseId: string,
  data: CreateModuleInput
) {
  // Map CreateModuleInput (with 'order') to API format (with 'index')
  const apiData = {
    title: data.title,
    index: data.order ?? 0,
  }
  const response = await apiPost<{
    id: string
    title: string
    index: number
    courseId: string
  }>(`/courses/${courseId}/modules`, apiData, {
    requireAuth: true,
  })
  // Map API response (with 'index') to Module type (with 'order')
  return {
    id: response.id,
    title: response.title,
    courseId: response.courseId,
    order: response.index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Module
}

export async function updateModule(
  moduleId: string,
  data: UpdateModuleInput
) {
  return apiPut<Module>(`/courses/modules/${moduleId}`, data, {
    requireAuth: true,
  })
}

export async function deleteModule(moduleId: string) {
  return apiDelete<void>(`/courses/modules/${moduleId}`, {
    requireAuth: true,
  })
}

// Lectures
export async function getModuleLectures(moduleId: string) {
  return apiGet<Lecture[]>(`/courses/modules/${moduleId}/lectures`, {
    requireAuth: true,
  })
}

export async function createLecture(
  moduleId: string,
  data: CreateLectureInput
) {
  // Map CreateLectureInput (with 'order') to API format (with 'index')
  const apiData = {
    title: data.title,
    index: data.order ?? 0,
  }
  const response = await apiPost<{
    id: string
    title: string
    index: number
    moduleId: string
  }>(`/courses/modules/${moduleId}/lectures`, apiData, {
    requireAuth: true,
  })
  // Map API response (with 'index') to Lecture type (with 'order')
  return {
    id: response.id,
    title: response.title,
    moduleId: response.moduleId,
    order: response.index,
    type: data.type || "TEXT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Lecture
}

export async function updateLecture(
  lectureId: string,
  data: UpdateLectureInput
) {
  return apiPut<Lecture>(`/courses/lectures/${lectureId}`, data, {
    requireAuth: true,
  })
}

export async function deleteLecture(lectureId: string) {
  return apiDelete<void>(`/courses/lectures/${lectureId}`, {
    requireAuth: true,
  })
}

// Content
export async function getLectureContents(lectureId: string) {
  const response = await apiGet<Array<{
    id: string
    kind: string
    text?: string
    mediaUrl?: string
    metadata?: Record<string, any>
    index: number
    lectureId: string
    createdAt?: string
    updatedAt?: string
  }>>(`/courses/lectures/${lectureId}/contents`, {
    requireAuth: true,
  })
  // Map API response (with 'kind' and 'index') to Content type (with 'type' and 'order')
  return response.map((content) => ({
    id: content.id,
    lectureId: content.lectureId,
    type: content.kind as Content["type"],
    text: content.text,
    mediaUrl: content.mediaUrl,
    metadata: content.metadata,
    order: content.index,
    createdAt: content.createdAt || new Date().toISOString(),
    updatedAt: content.updatedAt || new Date().toISOString(),
  })) as Content[]
}

export async function createContent(
  lectureId: string,
  data: CreateContentInput
) {
  // Map CreateContentInput (with 'type' and 'order') to API format (with 'kind' and 'index')
  const apiData = {
    kind: data.type,
    text: data.text,
    mediaUrl: data.mediaUrl,
    metadata: data.metadata,
    index: data.order ?? 0,
  }
  const response = await apiPost<{
    id: string
    kind: string
    text?: string
    mediaUrl?: string
    metadata?: Record<string, any>
    index: number
    lectureId: string
  }>(`/courses/lectures/${lectureId}/contents`, apiData, {
    requireAuth: true,
  })
  // Map API response (with 'kind' and 'index') to Content type (with 'type' and 'order')
  return {
    id: response.id,
    lectureId: response.lectureId,
    type: response.kind as Content["type"],
    text: response.text,
    mediaUrl: response.mediaUrl,
    metadata: response.metadata,
    order: response.index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Content
}

export async function updateContent(
  contentId: string,
  data: UpdateContentInput
) {
  return apiPut<Content>(`/courses/contents/${contentId}`, data, {
    requireAuth: true,
  })
}

export async function deleteContent(contentId: string) {
  return apiDelete<void>(`/courses/contents/${contentId}`, {
    requireAuth: true,
  })
}

export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  
  return apiPost<{ url: string; filename: string }>(
    "/storage/upload",
    formData,
    { requireAuth: true }
  )
}

// Students
export async function getInstructorStudents() {
  try {
    // Try the instructor/students endpoint first
    return await apiGet<any[]>("/instructor/students", {
      requireAuth: true,
    })
  } catch (error: any) {
    // If that fails, try to get students from enrollments
    // Get instructor's courses first, then get enrollments for each
    try {
      // Get current user to filter courses by instructor ID
      const currentUser = await apiGet<User>("/users/me", { requireAuth: true }).catch(() => null)
      const params = new URLSearchParams()
      params.append("include", "instructor")
      if (currentUser?.id) {
        params.append("instructorId", currentUser.id)
      }
      const courses = await apiGet<Course[]>(`/courses?${params.toString()}`, { requireAuth: true })
      
      // Get enrollments for all courses
      const enrollmentPromises = courses.map((course) =>
        apiGet<any[]>(`/courses/${course.id}/enrollments`, {
          requireAuth: true,
        }).catch(() => [])
      )
      
      const enrollmentsArrays = await Promise.all(enrollmentPromises)
      
      // Flatten and deduplicate students
      const studentsMap = new Map()
      enrollmentsArrays.flat().forEach((enrollment: any) => {
        const userId = enrollment.userId || enrollment.user?.id
        if (userId && !studentsMap.has(userId)) {
          studentsMap.set(userId, {
            id: userId,
            userId: userId,
            user: enrollment.user || {
              id: userId,
              firstName: enrollment.firstName,
              lastName: enrollment.lastName,
              email: enrollment.email,
            },
            enrollments: [enrollment],
          })
        } else if (userId) {
          // Add enrollment to existing student
          const student = studentsMap.get(userId)
          if (student && !student.enrollments.some((e: any) => e.id === enrollment.id)) {
            student.enrollments.push(enrollment)
          }
        }
      })
      
      // Fetch full user details for each student
      const studentsWithDetails = await Promise.all(
        Array.from(studentsMap.values()).map(async (student) => {
          try {
            const userDetails = await apiGet<User>(`/users/${student.userId}`, {
              requireAuth: true,
            })
            return {
              ...student,
              user: userDetails,
            }
          } catch (error) {
            console.error(`Failed to fetch user details for ${student.userId}:`, error)
            return student
          }
        })
      )
      
      return studentsWithDetails
    } catch (fallbackError) {
      console.error("Failed to fetch instructor students:", fallbackError)
      // Return empty array as fallback
      return []
    }
  }
}

// Get students enrolled in a specific course
export async function getCourseStudents(courseId: string) {
  try {
    // Get enrollments for the course
    const enrollments = await apiGet<any[]>(`/courses/${courseId}/enrollments`, {
      requireAuth: true,
    })
    
    // Fetch full user details for each enrolled student
    const studentsWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const userId = enrollment.userId || enrollment.user?.id
        if (!userId) return null
        
        try {
          const userDetails = await apiGet<User>(`/users/${userId}`, {
            requireAuth: true,
          })
          return {
            id: userId,
            userId: userId,
            user: userDetails,
            enrollment: enrollment,
            enrollmentStatus: enrollment.status || "ACTIVE",
            enrolledAt: enrollment.createdAt,
          }
        } catch (error) {
          console.error(`Failed to fetch user details for ${userId}:`, error)
          // Return basic info if user fetch fails
          return {
            id: userId,
            userId: userId,
            user: enrollment.user || {
              id: userId,
              firstName: enrollment.firstName,
              lastName: enrollment.lastName,
              email: enrollment.email,
            },
            enrollment: enrollment,
            enrollmentStatus: enrollment.status || "ACTIVE",
            enrolledAt: enrollment.createdAt,
          }
        }
      })
    )
    
    // Filter out null values
    return studentsWithDetails.filter((student) => student !== null)
  } catch (error) {
    console.error(`Failed to fetch students for course ${courseId}:`, error)
    return []
  }
}

export async function getStudentProgress(userId: string) {
  return apiGet<any>(`/progress/users/${userId}`, { requireAuth: true })
}

export async function getStudentDetails(userId: string) {
  return apiGet<User>(`/users/${userId}`, { requireAuth: true })
}

// Assignments
export async function getInstructorAssignments() {
  return apiGet<AssignmentWithCourse[]>("/assignments/instructor-assignments", {
    requireAuth: true,
  })
}

export async function createAssignment(
  courseId: string,
  data: CreateAssignmentInput
) {
  return apiPost<AssignmentWithCourse>(
    `/assignments/courses/${courseId}`,
    data,
    { requireAuth: true }
  )
}

export async function getAssignmentDetails(assignmentId: string) {
  return apiGet<AssignmentWithCourse>(`/assignments/${assignmentId}`, {
    requireAuth: true,
  })
}

export async function updateAssignment(
  assignmentId: string,
  data: UpdateAssignmentInput
) {
  return apiPut<AssignmentWithCourse>(`/assignments/${assignmentId}`, data, {
    requireAuth: true,
  })
}

export async function deleteAssignment(assignmentId: string) {
  return apiDelete<void>(`/assignments/${assignmentId}`, {
    requireAuth: true,
  })
}

export async function getAssignmentSubmissions(assignmentId: string) {
  return apiGet<SubmissionWithDetails[]>(
    `/assignments/${assignmentId}/submissions`,
    { requireAuth: true }
  )
}

export async function getSubmissionDetails(submissionId: string) {
  return apiGet<SubmissionWithDetails>(
    `/assignments/submissions/${submissionId}`,
    { requireAuth: true }
  )
}

export async function gradeSubmission(
  submissionId: string,
  data: GradeSubmissionInput
) {
  return apiPut<SubmissionWithDetails>(
    `/assignments/submissions/${submissionId}/grade`,
    data,
    { requireAuth: true }
  )
}

// Quizzes
export async function getInstructorQuizzes() {
  return apiGet<Quiz[]>("/quizzes/instructor-quizzes", { requireAuth: true })
}

export async function createQuiz(courseId: string, data: CreateQuizInput) {
  return apiPost<Quiz>(`/quizzes/courses/${courseId}`, data, {
    requireAuth: true,
  })
}

export async function getQuizDetails(quizId: string) {
  return apiGet<Quiz>(`/quizzes/${quizId}`, { requireAuth: true })
}

export async function updateQuiz(quizId: string, data: UpdateQuizInput) {
  return apiPut<Quiz>(`/quizzes/${quizId}`, data, { requireAuth: true })
}

export async function deleteQuiz(quizId: string) {
  return apiDelete<void>(`/quizzes/${quizId}`, { requireAuth: true })
}

export async function createQuestion(
  quizId: string,
  data: CreateQuestionInput
) {
  return apiPost<any>(`/quizzes/${quizId}/questions`, data, {
    requireAuth: true,
  })
}

export async function updateQuestion(
  questionId: string,
  data: UpdateQuestionInput
) {
  return apiPut<any>(`/quizzes/questions/${questionId}`, data, {
    requireAuth: true,
  })
}

export async function deleteQuestion(questionId: string) {
  return apiDelete<void>(`/quizzes/questions/${questionId}`, {
    requireAuth: true,
  })
}

export async function createOption(
  questionId: string,
  data: CreateOptionInput
) {
  return apiPost<any>(`/quizzes/questions/${questionId}/options`, data, {
    requireAuth: true,
  })
}

export async function updateOption(optionId: string, data: UpdateOptionInput) {
  return apiPut<any>(`/quizzes/options/${optionId}`, data, {
    requireAuth: true,
  })
}

export async function deleteOption(optionId: string) {
  return apiDelete<void>(`/quizzes/options/${optionId}`, {
    requireAuth: true,
  })
}

export async function getQuizAttempts(quizId: string) {
  return apiGet<QuizAttempt[]>(`/quizzes/${quizId}/attempts`, {
    requireAuth: true,
  })
}

export async function getQuizAttemptDetails(attemptId: string) {
  return apiGet<QuizAttempt>(`/quizzes/attempts/${attemptId}`, {
    requireAuth: true,
  })
}

// Analytics
export async function getCourseAnalytics(courseId: string) {
  return apiGet<CourseAnalytics>(`/analytics/courses/${courseId}`, {
    requireAuth: true,
  })
}

export async function getStudentStatistics() {
  return apiGet<StudentStatistics[]>("/analytics/students", {
    requireAuth: true,
  })
}

export async function getQuizStatistics(quizId: string) {
  return apiGet<QuizStatistics>(`/analytics/quizzes/${quizId}`, {
    requireAuth: true,
  })
}

