// Core types for API responses and entities

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  matricNumber?: string
  organizationId: string
  organization?: Organization
  createdAt: string
  updatedAt?: string
}

export interface Organization {
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
  }
  organizationId: string
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
  lastAccessedAt?: string
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
  organizationId?: string // Optional: only needed for users with multiple orgs or admin login
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  organizationId: string
  matricNumber?: string
}

export interface RegisterResponse extends LoginResponse {}

// Organization types
export interface CreateOrganizationRequest {
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

export interface UpdateOrganizationRequest {
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
  organizations: {
    totalOrganizations: number
    activeOrganizations: number
    averageUsersPerOrg: number
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

