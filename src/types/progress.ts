import type { CourseProgress } from "@/lib/types"

export interface Progress {
  id: string
  userId: string
  lectureId: string
  completed: boolean
  lastPosition?: number // For video/audio - position in seconds
  timeSpent?: number // Total time spent in seconds
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface LectureProgress {
  lectureId: string
  lectureTitle: string
  completed: boolean
  lastPosition?: number
  timeSpent?: number
  completedAt?: string
}

export interface ModuleProgress {
  moduleId: string
  moduleTitle: string
  totalLectures: number
  completedLectures: number
  progressPercentage: number
  lectures: LectureProgress[]
}

export interface DetailedCourseProgress extends CourseProgress {
  modules?: ModuleProgress[]
  lastActivity?: string
}

export interface Session {
  id: string
  userId: string
  courseId: string
  lectureId?: string
  startTime: string
  endTime?: string
  duration?: number // in seconds
  createdAt: string
}

export interface IncompleteTask {
  id: string
  type: "LECTURE" | "ASSIGNMENT" | "QUIZ"
  courseId: string
  courseTitle: string
  title: string
  dueDate?: string
  priority: "HIGH" | "MEDIUM" | "LOW"
}

export interface ProgressActivity {
  id: string
  userId: string
  type: "LECTURE_COMPLETED" | "ASSIGNMENT_SUBMITTED" | "QUIZ_COMPLETED" | "COURSE_STARTED"
  courseId: string
  courseTitle: string
  description: string
  createdAt: string
}

export interface OverallProgress {
  totalCourses: number
  enrolledCourses: number
  completedCourses: number
  inProgressCourses: number
  overallProgressPercentage: number
  totalTimeSpent: number // in seconds
  courses: CourseProgress[]
}

// Request types
export interface UpdateProgressInput {
  completed: boolean
  lastPosition?: number
  timeSpent?: number
}

export interface ProgressStats {
  totalLectures: number
  completedLectures: number
  totalTimeSpent: number
  averageCompletionRate: number
  coursesCompleted: number
  coursesInProgress: number
}

