import axios, { AxiosInstance, AxiosError } from "axios"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  Organization,
  User,
  GlobalStats,
  SystemHealth,
  ApiResponse,
  PaginatedResponse,
  Course,
  CourseProgress,
  ResumeData,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://lms-backend-k5t6.onrender.com"
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1"

class ApiClient {
  private client: AxiosInstance
  private refreshTokenPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - attach auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // If error is 401 and not already trying to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed - logout user
            this.clearTokens()
            // Don't redirect if we're already on login/signup pages
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname
              if (!currentPath.includes("/login") && !currentPath.includes("/signup") && !currentPath.includes("/onboarding")) {
                window.location.href = "/login"
              }
            }
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refreshToken")
  }

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
  }

  clearTokens() {
    if (typeof window === "undefined") return
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh calls
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error("No refresh token")
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/${API_VERSION}/auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
          }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        this.setTokens(accessToken, newRefreshToken)

        return accessToken
      } finally {
        this.refreshTokenPromise = null
      }
    })()

    return this.refreshTokenPromise
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use simple login if no organizationId provided (for students)
    // Use select-organization if organizationId provided (for admins with multiple orgs)
    const endpoint = credentials.organizationId 
      ? "/auth/login/select-organization" 
      : "/auth/login"
    const response = await this.client.post<LoginResponse>(endpoint, credentials)
    const { accessToken, refreshToken } = response.data
    this.setTokens(accessToken, refreshToken)
    return response.data
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>("/auth/register", data)
    const { accessToken, refreshToken } = response.data
    this.setTokens(accessToken, refreshToken)
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/auth/logout")
    } finally {
      this.clearTokens()
    }
  }

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    const response = await this.client.get<Organization[]>("/organizations")
    return response.data
  }

  async getOrganization(id: string): Promise<Organization> {
    const response = await this.client.get<Organization>(`/organizations/${id}`)
    return response.data
  }

  async getOrganizationBySlug(slug: string): Promise<Organization> {
    const response = await this.client.get<Organization>(`/organizations/slug/${slug}`)
    return response.data
  }

  async createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
    const response = await this.client.post<Organization>("/organizations", data)
    return response.data
  }

  async updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    const response = await this.client.put<Organization>(`/organizations/${id}`, data)
    return response.data
  }

  async deleteOrganization(id: string): Promise<void> {
    await this.client.delete(`/organizations/${id}`)
  }

  async getOrganizationStats(id: string): Promise<any> {
    const response = await this.client.get(`/organizations/${id}/stats`)
    return response.data
  }

  // Admin & Stats
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await this.client.get<GlobalStats>("/admin/stats")
    return response.data
  }

  async getUserStats(organizationId?: string): Promise<any> {
    const url = organizationId ? `/admin/stats/users?organizationId=${organizationId}` : "/admin/stats/users"
    const response = await this.client.get(url)
    return response.data
  }

  async getCourseStats(organizationId?: string): Promise<any> {
    const url = organizationId ? `/admin/stats/courses?organizationId=${organizationId}` : "/admin/stats/courses"
    const response = await this.client.get(url)
    return response.data
  }

  async getAllUsers(organizationId?: string): Promise<User[]> {
    const url = organizationId === "all" ? `/admin/users?organizationId=all` : organizationId ? `/admin/users?organizationId=${organizationId}` : "/admin/users"
    const response = await this.client.get<User[]>(url)
    return response.data
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`)
    return response.data
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const response = await this.client.put<User>(`/admin/users/${id}/role`, { role })
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/admin/users/${id}`)
  }

  async createEnrollment(userId: string, courseId: string): Promise<any> {
    const response = await this.client.post("/admin/enrollments", { userId, courseId })
    return response.data
  }

  // Courses
  async getCourses(organizationId?: string): Promise<Course[]> {
    const url = organizationId ? `/courses?organizationId=${organizationId}` : "/courses"
    const response = await this.client.get<Course[]>(url)
    return response.data
  }

  async getCourse(id: string): Promise<Course> {
    const response = await this.client.get<Course>(`/courses/${id}`)
    return response.data
  }

  // Progress
  async getMyProgress(): Promise<CourseProgress[]> {
    const response = await this.client.get<CourseProgress[]>("/progress/me")
    return response.data
  }

  async getResumeData(): Promise<ResumeData[]> {
    const response = await this.client.get<ResumeData[]>("/progress/resume")
    return response.data
  }

  async updateLectureProgress(lectureId: string, completed: boolean): Promise<any> {
    const response = await this.client.put(`/progress/lectures/${lectureId}`, { completed })
    return response.data
  }

  async getCourseProgress(courseId: string): Promise<any> {
    const response = await this.client.get(`/progress/courses/${courseId}`)
    return response.data
  }

  // Health
  async getHealth(): Promise<SystemHealth> {
    const response = await this.client.get<SystemHealth>("/health")
    return response.data
  }

  async getGlobalHealth(): Promise<any> {
    const response = await this.client.get("/health/global")
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export for direct use in components
export default apiClient

