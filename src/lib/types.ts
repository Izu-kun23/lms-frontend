// Core types for API responses and entities

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  studentId?: number
  matricNumber?: string
  schoolId: string
  school?: School
  emailVerified?: boolean
  createdAt: string
  updatedAt?: string
}

export interface School {
  id: string
  name: string
  slug: string
  domain?: string
  description?: string
  settings?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  title: string
  code: string
  summary: string
  coverUrl?: string
  instructorId: string
  instructor?: {
    id: string
    firstName: string
    lastName: string
    email?: string
    role?: string
  }
  schoolId: string
  createdAt: string
  updatedAt: string
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  course?: Course
  status: "ACTIVE" | "DROPPED" | "COMPLETED"
  createdAt: string
}

export interface CourseProgress {
  courseId: string
  courseTitle: string
  courseCode?: string
  totalLectures: number
  completedLectures: number
  progressPercentage: number
  currentLectureId?: string
  lastActivityAt?: string
  // Keep lastAccessedAt for backward compatibility
  lastAccessedAt?: string
  // Session data (when using with-session endpoint)
  session?: {
    id: string
    userId: string
    courseId: string
    lectureId?: string
    startTime: string
    endTime?: string
    duration?: number
    createdAt: string
  }
}

export interface ResumeData {
  courseId: string
  courseTitle: string
  courseCode?: string
  moduleId?: string
  moduleTitle?: string
  lectureId?: string
  lectureTitle?: string
  progressPercentage: number
}

// Authentication types
export interface LoginRequest {
  email: string
  password: string
  schoolId?: string // Optional: only needed for users with multiple schools or admin login
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
  schools?: School[]
  mfaRequired?: boolean
  mfaToken?: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN"
  schoolId: string
  studentId?: number
}

export interface RegisterResponse extends LoginResponse {}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  studentId?: number
  profilePicture?: string
  notificationPreferences?: {
    email?: boolean
    push?: boolean
    inApp?: boolean
  }
  learningPreferences?: {
    theme?: "light" | "dark" | "auto"
    language?: string
    accessibility?: {
      fontSize?: "small" | "medium" | "large"
      highContrast?: boolean
      screenReader?: boolean
    }
  }
}

// School types
export interface CreateSchoolRequest {
  name: string
  slug: string
  domain?: string
  description?: string
  settings?: Record<string, any>
  adminEmail: string
  adminFirstName: string
  adminLastName: string
  adminPassword: string
  adminStudentId?: number
}

export interface UpdateSchoolRequest {
  name?: string
  slug?: string
  domain?: string
  description?: string
  settings?: Record<string, any>
  isActive?: boolean
}

// API Response wrapper
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Stats types
export interface GlobalStats {
  users: {
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    userGrowthRate: number
  }
  schools: {
    totalSchools: number
    activeSchools: number
    averageUsersPerSchool: number
  }
  courses: {
    totalCourses: number
    activeCourses: number
    averageEnrollmentsPerCourse: number
  }
  system: {
    uptime: number
    averageResponseTime: number
    errorRate: number
    storageUsage: string
  }
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "down"
  timestamp: string
  services: {
    api: string
    database: string
    websocket?: string
    storage?: string
  }
  performance: {
    uptime: number
    responseTime: number
    throughput: number
    errorRate: number
  }
  resources: {
    cpu: string
    memory: string
    storage: string
    network: string
  }
}

export interface Assignment {
  id: string
  courseId: string
  course?: Course
  title: string
  description: string
  dueAt?: string
  maxScore?: number
  createdAt: string
  updatedAt: string
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  assignment?: Assignment
  userId: string
  fileUrl?: string
  text?: string
  grade?: number
  feedback?: string
  submittedAt?: string
  gradedAt?: string
  status: "PENDING" | "SUBMITTED" | "GRADED"
  createdAt: string
  updatedAt: string
}

export interface MessageThread {
  id: string
  courseId: string
  course?: Course
  title: string
  createdAt: string
  updatedAt: string
  lastMessageAt?: string
  messageCount?: number
}

export interface Message {
  id: string
  threadId: string
  thread?: MessageThread
  userId: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  body: string
  createdAt: string
  updatedAt: string
}

