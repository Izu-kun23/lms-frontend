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

export async function updateLectureProgress(
  lectureId: string,
  data: UpdateProgressInput
) {
  return apiPut<{ completed: boolean; lastPosition?: number }>(
    `/progress/lectures/${lectureId}`,
    data,
    { requireAuth: true }
  )
}

export async function getLectureProgress(lectureId: string) {
  return apiGet<{ completed: boolean; lastPosition?: number }>(
    `/progress/lectures/${lectureId}`,
    { requireAuth: true }
  )
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
  return apiGet<AssignmentWithCourse[]>("/assignments/my-assignments", {
    requireAuth: true,
  })
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
  return apiGet<Quiz[]>("/quizzes/my-quizzes", { requireAuth: true })
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

