import { apiGet, apiPost, apiPut, apiDelete, ApiError } from "./api-client"
import type { Course, User, CourseProgress } from "@/lib/types"
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

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"])

async function resolveInstructorFilter(
  instructorId?: string,
  userRole?: string
) {
  let resolvedRole = userRole?.toUpperCase()
  let resolvedInstructorId = instructorId

  // Always fetch current user to ensure we have the correct role and ID
  try {
    const currentUser = await apiGet<User>("/users/me", { requireAuth: true })
    resolvedRole = resolvedRole || currentUser.role?.toUpperCase()
    
    // For instructors, always use their ID to filter courses
    // Only allow override if explicitly provided (for admins viewing specific instructor's courses)
    if (currentUser.role?.toUpperCase() === "INSTRUCTOR") {
      // If no instructorId was explicitly provided, use the current user's ID
      // This ensures instructors only see their own courses
      if (!instructorId) {
        resolvedInstructorId = currentUser.id
      }
      // If an instructorId was provided but it doesn't match the current user,
      // still use current user's ID (instructors can't view other instructors' courses)
      else if (instructorId !== currentUser.id) {
        resolvedInstructorId = currentUser.id
      }
    }
  } catch (error) {
    console.warn("[InstructorAPI] Failed to resolve instructor filter", error)
  }

  const isAdmin = resolvedRole ? ADMIN_ROLES.has(resolvedRole) : false

  return {
    instructorId: isAdmin ? undefined : resolvedInstructorId,
    role: resolvedRole,
  }
}

// Dashboard
export async function fetchInstructorDashboard(instructorId?: string, userRole?: string) {
  const params = new URLSearchParams()
  params.append("include", "instructor")
  const { instructorId: resolvedInstructorId } = await resolveInstructorFilter(instructorId, userRole)
  if (resolvedInstructorId) {
    params.append("instructorId", resolvedInstructorId)
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
  const { instructorId: resolvedInstructorId } = await resolveInstructorFilter(instructorId, userRole)
  if (resolvedInstructorId) {
    params.append("instructorId", resolvedInstructorId)
  }
  return apiGet<Course[]>(`/courses?${params.toString()}`, { requireAuth: true })
}

export async function getCourseDetails(courseId: string, instructorId?: string, userRole?: string) {
  const course = await apiGet<CourseWithModules>(`/courses/${courseId}?include=instructor`, {
    requireAuth: true,
  })

  // For instructors, verify they are assigned to this course
  const { instructorId: resolvedInstructorId, role } = await resolveInstructorFilter(instructorId, userRole)
  const isAdmin = role ? ADMIN_ROLES.has(role) : false
  
  // If user is an instructor (not admin), verify they own this course
  if (!isAdmin && resolvedInstructorId && course.instructorId !== resolvedInstructorId) {
    throw new Error("Access denied: You can only access courses assigned to you")
  }

  return course
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
    summary?: string
    coverUrl?: string
    // Note: code is not supported by the API for updates (only in response)
  }
) {
  // API only accepts: title, summary, coverUrl
  const payload: {
    title?: string
    summary?: string
    coverUrl?: string
  } = {}
  
  if (data.title !== undefined) {
    payload.title = data.title
  }
  if (data.summary !== undefined) {
    payload.summary = data.summary
  }
  if (data.coverUrl !== undefined) {
    payload.coverUrl = data.coverUrl
  }
  
  return apiPut<Course>(`/courses/${courseId}`, payload, { requireAuth: true })
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
  // Order must start from 1, not 0 (0 causes null error)
  const apiData = {
    title: data.title,
    index: data.order ?? 1,
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
  // Order must start from 1, not 0 (0 causes null error)
  const apiData = {
    title: data.title,
    index: data.order ?? 1,
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
  // Order must start from 1, not 0 (0 causes null error)
  const apiData = {
    kind: data.type,
    text: data.text,
    mediaUrl: data.mediaUrl,
    metadata: data.metadata,
    index: data.order ?? 1,
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
    // Use the enrolled-students endpoint which returns formatted student data
    const enrolledStudents = await apiGet<Array<{
      enrollmentId: string
      studentId: string
      firstName: string
      lastName: string
      email: string
      studentIdNumber?: number
      enrollmentStatus: string
      enrolledAt: string
    }>>(`/courses/${courseId}/enrolled-students`, {
      requireAuth: true,
    })
    
    // Map to a consistent format
    return enrolledStudents.map((student) => ({
      id: student.studentId,
      userId: student.studentId,
      studentId: student.studentId,
      enrollmentId: student.enrollmentId,
      user: {
        id: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
      enrollmentStatus: student.enrollmentStatus,
      enrolledAt: student.enrolledAt,
      studentIdNumber: student.studentIdNumber,
    }))
  } catch (error) {
    console.error(`Failed to fetch enrolled students for course ${courseId}:`, error)
    // Fallback to old endpoint if new one fails
    try {
      const enrollments = await apiGet<any[]>(`/courses/${courseId}/enrollments`, {
        requireAuth: true,
      })
      
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
      
      return studentsWithDetails.filter((student) => student !== null)
    } catch (fallbackError) {
      console.error(`Failed to fetch students for course ${courseId} (fallback):`, fallbackError)
      return []
    }
  }
}

export async function getStudentProgress(userId: string) {
  return apiGet<any>(`/progress/users/${userId}`, { requireAuth: true })
}

export async function getCourseProgress(courseId: string) {
  return apiGet<CourseProgress>(`/progress/courses/${courseId}`, {
    requireAuth: true,
  })
}

export async function getCourseProgressWithSession(courseId: string) {
  return apiGet<CourseProgress>(`/progress/courses/${courseId}/with-session`, {
    requireAuth: true,
  })
}

export async function getStudentDetails(userId: string) {
  return apiGet<User>(`/users/${userId}`, { requireAuth: true })
}

// Assignments
export async function getInstructorAssignments(instructorId?: string, userRole?: string) {
  const courses = await getInstructorCourses(instructorId, userRole).catch((error) => {
    console.error("[InstructorAPI] Failed to fetch courses for assignments:", error)
    return [] as Course[]
  })

  if (courses.length === 0) {
    return []
  }

  const assignmentResponses = await Promise.all(
    courses.map(async (course) => {
      try {
        const assignments = await apiGet<AssignmentWithCourse[]>(
          `/assignments/courses/${course.id}`,
          { requireAuth: true }
        )

        return assignments.map((assignment) => ({
          ...assignment,
          course:
            assignment.course ||
            ({
              id: course.id,
              title: course.title,
              code: course.code,
            } as AssignmentWithCourse["course"]),
        }))
      } catch (error) {
        console.error(
          `[InstructorAPI] Failed to fetch assignments for course ${course.id}:`,
          error
        )
        return []
      }
    })
  )

  return assignmentResponses.flat()
}

export async function createAssignment(
  courseId: string,
  data: CreateAssignmentInput
) {
  // API only accepts: title, description, dueAt (maxScore and files not supported in create)
  const payload: {
    title: string
    description: string
    dueAt?: string
  } = {
    title: data.title,
    description: data.description,
  }
  if (data.dueAt) {
    payload.dueAt = data.dueAt
  }
  return apiPost<AssignmentWithCourse>(
    `/assignments/courses/${courseId}`,
    payload,
    { requireAuth: true }
  )
}

export async function getAssignmentDetails(assignmentId: string) {
  const assignment = await apiGet<AssignmentWithCourse>(`/assignments/${assignmentId}`, {
    requireAuth: true,
  })
  
  // Ensure course data is included - fetch if missing
  if (!assignment.course && assignment.courseId) {
    try {
      const course = await apiGet<Course>(`/courses/${assignment.courseId}`, {
        requireAuth: true,
      })
      assignment.course = {
        id: course.id,
        title: course.title,
        code: course.code,
      }
    } catch (error) {
      console.warn(`[InstructorAPI] Failed to fetch course ${assignment.courseId} for assignment:`, error)
    }
  }
  
  return assignment
}

export async function getInstructorAssignmentById(
  assignmentId: string,
  instructorId?: string,
  userRole?: string
) {
  try {
    return await getAssignmentDetails(assignmentId)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      const assignments = await getInstructorAssignments(instructorId, userRole).catch(() => [])
      return assignments.find((assignment) => assignment.id === assignmentId) || null
    }
    throw error
  }
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

