import { apiGet, apiPost, apiPut } from "./api-client"
import type { Course } from "@/lib/types"
import type {
  CourseWithModules,
  Module,
  Lecture,
  Content,
} from "@/types/course"
import type {
  CourseProgress,
  OverallProgress,
  ProgressActivity,
  IncompleteTask,
  UpdateProgressInput,
} from "@/types/progress"
import type {
  AssignmentWithCourse,
  SubmissionWithDetails,
  SubmitAssignmentInput,
} from "@/types/assignment"
import type { Quiz, QuizAttempt, SubmitQuizInput } from "@/types/quiz"

// Dashboard
export async function fetchStudentDashboard() {
  const [courses, progress, upcomingAssignments] = await Promise.all([
    apiGet<Course[]>(`/courses?include=instructor`, { requireAuth: true }),
    apiGet<CourseProgress[]>("/progress/me", { requireAuth: true }),
    apiGet<AssignmentWithCourse[]>("/assignments/upcoming", {
      requireAuth: true,
    }).catch(() => [] as AssignmentWithCourse[]),
  ])

  return {
    courses,
    progress,
    upcomingAssignments,
  }
}

// Courses
export async function getEnrolledCourses() {
  return apiGet<Course[]>(`/courses?include=instructor`, { requireAuth: true })
}

export async function getCourseDetails(courseId: string) {
  return apiGet<CourseWithModules>(`/courses/${courseId}?include=instructor`, {
    requireAuth: true,
  })
}

export async function getCourseModules(courseId: string) {
  return apiGet<Module[]>(`/courses/${courseId}/modules`, {
    requireAuth: true,
  })
}

export async function getModuleLectures(moduleId: string) {
  return apiGet<Lecture[]>(`/courses/modules/${moduleId}/lectures`, {
    requireAuth: true,
  })
}

export async function getLectureContents(lectureId: string) {
  const response = await apiGet<Array<{
    id: string
    kind: string
    text?: string
    mediaUrl?: string
    metadata?: Record<string, any>
    index: number
    lectureId: string
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

// Progress
export async function getOverallProgress() {
  return apiGet<OverallProgress>("/progress/me", { requireAuth: true })
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

export async function updateLectureProgress(
  lectureId: string,
  data: UpdateProgressInput
) {
  // Map UpdateProgressInput to API format
  const payload: {
    completed?: boolean
    lastPosition?: number
    lastContentId?: string
    timeSpent?: number
  } = {}
  
  if (data.completed !== undefined) {
    payload.completed = data.completed
  }
  if (data.lastPosition !== undefined) {
    payload.lastPosition = data.lastPosition
  }
  if (data.timeSpent !== undefined) {
    payload.timeSpent = data.timeSpent
  }
  
  return apiPut<{
    id: string
    userId: string
    lectureId: string
    completed: boolean
    lastPosition?: number
    lastContentId?: string
    timeSpent?: number
    autoSavedAt?: string
    startedAt?: string
    completedAt?: string
    updatedAt: string
  }>(`/progress/lectures/${lectureId}`, payload, { requireAuth: true })
}

export async function getLectureProgress(lectureId: string) {
  return apiGet<{
    id: string
    userId: string
    lectureId: string
    completed: boolean
    lastPosition?: number
    lastContentId?: string
    timeSpent?: number
    autoSavedAt?: string
    startedAt?: string
    completedAt?: string
    updatedAt: string
  }>(`/progress/lectures/${lectureId}`, { requireAuth: true })
}

export async function autoSaveLectureProgress(
  lectureId: string,
  data: {
    lastPosition?: number
    lastContentId?: string
    timeSpent?: number
    sessionData?: Record<string, any>
  }
) {
  return apiPost<{
    id: string
    userId: string
    lectureId: string
    completed: boolean
    lastPosition?: number
    lastContentId?: string
    timeSpent?: number
    autoSavedAt?: string
    startedAt?: string
    completedAt?: string
    updatedAt: string
  }>(`/progress/lectures/${lectureId}/auto-save`, data, { requireAuth: true })
}

export async function getCourseSession(courseId: string) {
  return apiGet<{
    id: string
    userId: string
    courseId: string
    currentLectureId?: string
    lastActivityAt?: string
    sessionData?: Record<string, any>
    createdAt: string
    updatedAt: string
  }>(`/progress/sessions/course/${courseId}`, { requireAuth: true })
}

export async function getUserProgress(userId: string) {
  return apiGet<CourseProgress[]>(`/progress/users/${userId}`, { requireAuth: true })
}

export async function getResumeData() {
  return apiGet<{
    sessions: Array<{
      id: string
      userId: string
      courseId: string
      currentLectureId?: string
      lastActivityAt?: string
      sessionData?: Record<string, any>
      createdAt: string
      updatedAt: string
    }>
    incompleteTasks: Array<{
      id: string
      userId: string
      taskType: string
      taskId: string
      courseId: string
      title: string
      description?: string
      dueDate?: string
      priority: string
      isActive: boolean
      createdAt: string
      updatedAt: string
    }>
    recentProgress: Array<{
      id: string
      userId: string
      lectureId: string
      completed: boolean
      lastPosition?: number
      lastContentId?: string
      timeSpent?: number
      autoSavedAt?: string
      startedAt?: string
      completedAt?: string
      updatedAt: string
    }>
  }>(`/progress/resume`, { requireAuth: true })
}

export async function getRecentActivity() {
  return apiGet<ProgressActivity[]>("/progress/recent", {
    requireAuth: true,
  }).catch(() => [] as ProgressActivity[])
}

export async function getIncompleteTasks() {
  return apiGet<IncompleteTask[]>("/progress/incomplete", {
    requireAuth: true,
  }).catch(() => [] as IncompleteTask[])
}

export async function getUserSessions() {
  return apiGet<any[]>("/progress/sessions", { requireAuth: true }).catch(
    () => []
  )
}

// Assignments
export async function getMyAssignments() {
  try {
    // Try the my-assignments endpoint first
    return await apiGet<AssignmentWithCourse[]>("/assignments/my-assignments", {
      requireAuth: true,
    })
  } catch (error: any) {
    // If that fails, try the upcoming endpoint (which we know works from dashboard)
    if (error?.status === 404 || error?.message?.includes("not found")) {
      try {
        const upcoming = await apiGet<AssignmentWithCourse[]>("/assignments/upcoming", {
          requireAuth: true,
        })
        // If upcoming works, also try to get all assignments from enrolled courses
        // to get a complete list (not just upcoming)
        try {
          const courses = await getEnrolledCourses()
          const assignmentPromises = courses.map(async (course) => {
            try {
              const assignments = await apiGet<AssignmentWithCourse[]>(
                `/assignments/courses/${course.id}`,
                { requireAuth: true }
              )
              return assignments.map((assignment) => ({
                ...assignment,
                course: assignment.course || {
                  id: course.id,
                  title: course.title,
                  code: course.code,
                },
              }))
            } catch (err) {
              console.error(`Failed to fetch assignments for course ${course.id}:`, err)
              return []
            }
          })
          const assignmentArrays = await Promise.all(assignmentPromises)
          const allAssignments = assignmentArrays.flat()
          
          // Merge and deduplicate (prefer assignments from courses endpoint as it's more complete)
          const assignmentMap = new Map<string, AssignmentWithCourse>()
          allAssignments.forEach((assignment) => {
            assignmentMap.set(assignment.id, assignment)
          })
          upcoming.forEach((assignment) => {
            if (!assignmentMap.has(assignment.id)) {
              assignmentMap.set(assignment.id, assignment)
            }
          })
          
          return Array.from(assignmentMap.values())
        } catch (courseError) {
          // If fetching from courses fails, at least return upcoming assignments
          console.error("Failed to fetch assignments from enrolled courses:", courseError)
          return upcoming
        }
      } catch (upcomingError) {
        // Final fallback: try to get from enrolled courses directly
        try {
          const courses = await getEnrolledCourses()
          const assignmentPromises = courses.map(async (course) => {
            try {
              const assignments = await apiGet<AssignmentWithCourse[]>(
                `/assignments/courses/${course.id}`,
                { requireAuth: true }
              )
              return assignments.map((assignment) => ({
                ...assignment,
                course: assignment.course || {
                  id: course.id,
                  title: course.title,
                  code: course.code,
                },
              }))
            } catch (err) {
              console.error(`Failed to fetch assignments for course ${course.id}:`, err)
              return []
            }
          })
          const assignmentArrays = await Promise.all(assignmentPromises)
          return assignmentArrays.flat()
        } catch (finalError) {
          console.error("All assignment fetch methods failed:", finalError)
          // Return empty array as final fallback
          return []
        }
      }
    }
    // Re-throw other errors (not 404)
    throw error
  }
}

export async function getAssignmentDetails(assignmentId: string) {
  return apiGet<AssignmentWithCourse>(`/assignments/${assignmentId}`, {
    requireAuth: true,
  })
}

export async function getSubmission(submissionId: string) {
  return apiGet<SubmissionWithDetails>(`/assignments/submissions/${submissionId}`, {
    requireAuth: true,
  })
}

export async function submitAssignment(
  assignmentId: string,
  data: SubmitAssignmentInput
) {
  const formData = new FormData()
  
  if (data.files) {
    data.files.forEach((file) => {
      formData.append("files", file)
    })
  }
  
  if (data.text) {
    formData.append("text", data.text)
  }
  
  if (data.notes) {
    formData.append("notes", data.notes)
  }

  return apiPost<SubmissionWithDetails>(
    `/assignments/${assignmentId}/submit`,
    formData,
    { requireAuth: true }
  )
}

export async function updateSubmission(
  assignmentId: string,
  data: SubmitAssignmentInput
) {
  const formData = new FormData()
  
  if (data.files) {
    data.files.forEach((file) => {
      formData.append("files", file)
    })
  }
  
  if (data.text) {
    formData.append("text", data.text)
  }

  return apiPut<SubmissionWithDetails>(
    `/assignments/${assignmentId}/submit`,
    formData,
    { requireAuth: true }
  )
}

// Quizzes
export async function getMyQuizzes() {
  try {
    // Try the my-quizzes endpoint first
    return await apiGet<Quiz[]>("/quizzes/my-quizzes", { requireAuth: true })
  } catch (error: any) {
    // If that fails, try to get quizzes from enrolled courses
    if (error?.status === 404 || error?.message?.includes("not found")) {
      try {
        // Get enrolled courses
        const courses = await getEnrolledCourses()
        
        // Get quizzes for each course
        const quizPromises = courses.map(async (course) => {
          try {
            const quizzes = await apiGet<Quiz[]>(
              `/quizzes/courses/${course.id}`,
              { requireAuth: true }
            )
            return quizzes
          } catch (err) {
            console.error(`Failed to fetch quizzes for course ${course.id}:`, err)
            return []
          }
        })
        
        const quizArrays = await Promise.all(quizPromises)
        return quizArrays.flat()
      } catch (fallbackError) {
        console.error("Failed to fetch quizzes from enrolled courses:", fallbackError)
        // Return empty array as final fallback
        return []
      }
    }
    // Re-throw other errors
    throw error
  }
}

export async function getQuizDetails(quizId: string) {
  return apiGet<Quiz>(`/quizzes/${quizId}`, { requireAuth: true })
}

export async function validateQuizAnswers(
  quizId: string,
  answers: SubmitQuizInput["answers"]
) {
  return apiPost<{ score: number; feedback: any[] }>(
    `/quizzes/${quizId}/validate`,
    { answers },
    { requireAuth: true }
  )
}

export async function submitQuizAttempt(
  quizId: string,
  data: SubmitQuizInput
) {
  return apiPost<QuizAttempt>(`/quizzes/${quizId}/attempts`, data, {
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

